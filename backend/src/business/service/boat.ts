import { RowDataPacket } from 'mysql2';
import {
    BoatDatabaseInterface,
    ExpectedCreateBody
} from '../../data/interfaces/boat';
import { Boat } from '../model/boat';
import { DetailedBoat, IncomingDetailedBoat } from '../model/boat-detailed';
import { SearchQuery } from '../model/searchQuery';
import { BoatModel } from '../../util/database/sequelize/models/boat';
import BoatImageModel from '../../util/database/sequelize/models/boatimage';
import { FacilityModel } from '../../util/database/sequelize/models/facility';
import { Transaction } from 'sequelize';
import { Connection } from 'mysql2/promise';

/**
 * @author Youri Janssen && Marcus K & Thijs van Rixoort
 * Service class for managing boat-related operations.
 * @class DetailedBoatService The second half of is dedicated to finding all the data relevant to a singular boat, to be displayed on pages that need all of it.
 */
export class BoatService {
    /**
     * @author Youri Janssen
     * Creates an instance of BoatService.
     * @param {BoatDatabaseInterface} boatDatabase - The database interface for boat operations.
     * @designpattern Dependency Injection (DI)
     */
    public constructor(private boatDatabase: BoatDatabaseInterface) {}

    /**
     * Searches for boats based on the provided name, limit and offset.
     * @param {string} searchTerm - The searchTerm to search for.
     * @param limit The result limit for the query.
     * @param offset The offset for the query results.
     * @returns {Promise<Boat[] | string[] | 'server_error'>} The search result.
     * @author Youri Janssen & Thijs van Rixoort
     */
    async searchBoats(
        searchTerm: string,
        limit: number,
        offset: number
    ): Promise<Boat[] | string[] | 'server_error'> {
        const searchQuery = new SearchQuery(searchTerm);
        const queryValidation: string[] | null = searchQuery.validateQuery();

        if (queryValidation === null) {
            const searchedBoats = await this.boatDatabase.searchBoats(
                searchTerm,
                limit,
                offset
            );
            return searchedBoats;
        } else {
            return queryValidation;
        }
    }

    /**
     * The following section is dedicated to retrieving all details about a singular boat.
     */

    /**
     * A small function that check's if the incoming ID is a number, if so, it passes it through to the boatsInterface to Query.
     * @param id is the incoming boat ID getting checked if it's a number or not and passes along if it is.
     * @returns status, which either contain details about the boat, or nothing at all.
     * @author Marcus K.
     */
    public async findBoat(id: number): Promise<DetailedBoat | null> {
        const status: DetailedBoat | null = !Number.isNaN(id)
            ? await this.getDetailedBoat(id)
            : null;

        return status;
    }

    /**
     * @function compileBoatData runs all the queries to get the data of one boat and then merges them into one.
     * @param id is the id for a given boat.
     * @returns either a detailedBoat or nothing.
     * @author Marcus K.
     */
    private async getDetailedBoat(id: number): Promise<DetailedBoat | null> {
        const boat: RowDataPacket | BoatModel | null =
            await this.boatDatabase.getMainData(id);

        const facilities: RowDataPacket[] | BoatModel[] | null =
            await this.boatDatabase.getFacilityData(id);

        const images: RowDataPacket[] | BoatImageModel[] | null =
            await this.boatDatabase.getImageData(id);

        return await this.boatDatabase.findOneBoat(boat, facilities, images);
    }

    /**
     * The following section is dedicated to creating a boat
     */

    /**
     * @function createBoat calls the interface to start a transaction for creating a boat from the controller's boat data.
     * It starts a transaction, verifies the incoming data to put it in a new object, runs queries and either returns success or rollbacks and failure.
     * @param incomingBoat is all the boat data used to create a boat. Technically we wouldn't know what the user sends, so shouldn't it be unknown? Not that it matters, missing values are just Undefined anyway.
     * @returns an object reporting if a boat has been created or not. If not, it reports why.
     * @author Marcus K.
     */
    public async createBoat(
        incomingBoat: ExpectedCreateBody
    ): Promise<{ created: boolean; message: string }> {
        let isCreated: boolean;
        let statusMessage: string;
        const transaction: Transaction | Connection =
            await this.boatDatabase.startTransaction();

        try {
            if (incomingBoat.imageArray) {
                incomingBoat.imageArray = incomingBoat.imageArray.map(
                    (image: string) => {
                        return IncomingDetailedBoat.validateUrl(image);
                    }
                );
            }

            const boatData: IncomingDetailedBoat =
                this.createBoatObject(incomingBoat);

            await this.creationQueries(boatData, transaction);

            await this.boatDatabase.endTransaction(transaction);
            [isCreated, statusMessage] = [
                true,
                'A New Boat Has Been Created Successfully!'
            ];
        } catch (error: unknown) {
            console.log(error);
            await this.boatDatabase.transactionRollback(transaction);
            /* I agree that this is a silly one, but it works! */
            [isCreated, statusMessage] = [false, '' + error];
        }
        return {
            created: isCreated,
            message: statusMessage
        };
    }

    /**
     * @method createBoatObject takes incoming boat values and creates a new object using it, while verifying if this incoming data is valid or not.
     * Verification CAN throw an error, ending createBoat prematurely.
     * @param incomingBoat is all the boat data used to create a boat. Still not a IncomingDetailedBoat, but technically something unknown.
     * @returns finally an IncomingDetailedBoat, which is a data valid boat.
     */

    private createBoatObject(
        incomingBoat: ExpectedCreateBody
    ): IncomingDetailedBoat {
        return IncomingDetailedBoat.createIncomingBoat(
            incomingBoat.name,
            incomingBoat.price,
            incomingBoat.capacity,
            incomingBoat.licenseRequired,
            incomingBoat.skipperRequired,

            incomingBoat.id,
            incomingBoat.description,
            incomingBoat.fabricationYear,
            incomingBoat.length,
            incomingBoat.active,
            incomingBoat.model,
            incomingBoat.brandName,

            incomingBoat.modelId,
            incomingBoat.facilityArray,
            incomingBoat.imageArray
        );
    }

    /**
     * @method creationQueries looks at what data it has recieved and calls queries to run based upon that.
     * Assuming the incoming data from method createBoat is valid, it always runs createNewBoat. All other queries are only run if there's values for them.
     * @param boatData is the boatData used to create a boat.
     * @param transaction is the current transaction this is ran with, to make a query part of that transaction.
     */
    private async creationQueries(
        boatData: IncomingDetailedBoat,
        transaction: Transaction | Connection
    ): Promise<void> {
        if (!boatData.modelId && boatData.brandName && boatData.model) {
            boatData.modelId = await this.boatDatabase.assignBrand(
                {
                    brandName: boatData.brandName,
                    model: boatData.model
                },
                transaction
            );
        }

        const newBoat: IncomingDetailedBoat['id'] | BoatModel =
            await this.boatDatabase.createNewBoat(boatData, transaction);

        if (boatData.facilityArray) {
            const facilityIds: FacilityModel[] | number[] =
                await this.boatDatabase.createFacilities(
                    boatData.facilityArray,
                    transaction
                );

            await this.boatDatabase.assignFacilities(
                newBoat,
                transaction,
                facilityIds
            );
        }

        if (boatData.imageArray) {
            await this.boatDatabase.assignImages(
                boatData.imageArray,
                transaction,
                newBoat
            );
        }
    }

    /**
     * @method getBoatOptions is a somewhat messy solution of getting pre-existing options available to the user.
     * This is 1000% getting refactored and overhauled once I have the chance.
     * @returns An object with two objects, one containing facility data, one containing model/brandname data.
     * @author Marcus K.
     */
    public async getBoatOptions(): Promise<{
        facilities: {
            id: number;
            facility: string;
        }[];
        models: {
            id: number;
            model: string;
            brandname: string;
        }[];
    }> {
        const returnValue: {
            facilities: {
                id: number;
                facility: string;
            }[];
            models: {
                id: number;
                model: string;
                brandname: string;
            }[];
        } = await this.boatDatabase.getBoatOptions();

        return returnValue;
    }
}
