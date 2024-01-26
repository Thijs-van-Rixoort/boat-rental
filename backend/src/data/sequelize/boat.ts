import { Op, Transaction } from 'sequelize';
import { Boat } from '../../business/model/boat';
import { BoatDatabaseInterface } from '../interfaces/boat';
import {
    DetailedBoat,
    IncomingDetailedBoat
} from '../../business/model/boat-detailed';
import { BoatModel } from '../../util/database/sequelize/models/boat';
import BoatImageModel from '../../util/database/sequelize/models/boatimage';
import { FacilityModel } from '../../util/database/sequelize/models/facility';
import BoatTypeModel from '../../util/database/sequelize/models/boatmodel';
import { SequelizeDatabaseConfig } from '../../util/database/sequelize/sequelize';
import sequelize from 'sequelize/types/sequelize';

/**
 * A very simple type just to make the @function arraySanitiser a bit more readable
 * @author Marcus K.
 */
type sanitiserModels = Array<FacilityModel | BoatImageModel>;

type cleanedFacilities = Array<{ id: number; facility: string }>;

type cleanedModels = Array<{
    id: number;
    model: string;
    brandname: string;
}>;

/**
 * A class handling database operations related to the Boat model using Sequelize.
 * @designpattern Repository Pattern - A design pattern that separates the data access logic from the business logic. It helps to achieve a separation of concerns and enables the application to have a more flexible architecture.
 * @author Youri Janssen & Marcus K & Thijs van Rixoort
 */

export class BoatSequelizeDatabase implements BoatDatabaseInterface {
    /**
     * Searches for boats based on the name, limit and offset.
     * @param {string} name - The name to search for.
     * @param limit The result limit for the query.
     * @param offset The offset for the query results.
     * @returns {Promise<Boat[] | 'server_error'>} A promise containing an array of boats, an empty array if no boats are found, or 'server_error' in case of an error.
     * @author Youri Janssen & Thijs van Rixoort
     */
    public async searchBoats(
        name: string,
        limit: number,
        offset: number
    ): Promise<Boat[] | 'server_error'> {
        try {
            const boats = await this.findBoatsByName(name, limit, offset);
            if (boats.length === 0) {
                return [];
            }

            return await this.mapBoatsData(boats);
        } catch (error) {
            return 'server_error';
        }
    }

    /**
     * Finds boats by name.
     * @param {string} name - The name to search for.
     * @param limit The result limit for the query.
     * @param offset The offset for the query results.
     * @returns {Promise<BoatModel[]>} A promise containing an array of BoatModel instances.
     * @author Youri Janssen & Thijs van Rixoort
     */
    private async findBoatsByName(
        name: string,
        limit: number,
        offset: number
    ): Promise<BoatModel[]> {
        return await BoatModel.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`
                },
                active: true
            },
            limit: limit,
            offset: offset,
            order: [['name', 'ASC']]
        });
    }

    /**
     * @author Youri Janssen
     * Maps the data of boats.
     * @param {BoatModel[]} boats - An array of BoatModel instances.
     * @returns {Promise<Boat[]>} A promise containing an array of Boat business model instances.
     * The $get method is used to retrieve associated data or related instances from an associated model.
     */
    private async mapBoatsData(boats: BoatModel[]): Promise<Boat[]> {
        const mappedBoats: Boat[] = [];
        for (const boat of boats) {
            const imagePaths: string[] = await this.getBoatImages(boat);
            const facilities: FacilityModel[] = await boat.$get('facilities');
            const facilityNames: string[] = facilities.map(
                facility => facility.facility
            );
            const mappedBoat = Boat.createBoatWithId(
                boat.id,
                boat.name,
                boat.price_per_day_in_cents,
                boat.capacity,
                boat.license_required,
                boat.skipper_required,
                facilityNames,
                imagePaths
            );
            mappedBoats.push(mappedBoat);
        }
        return mappedBoats;
    }

    private async getBoatImages(boat: BoatModel): Promise<string[]> {
        const boatImages: BoatImageModel[] = await boat.$get('images');
        const imagePaths: string[] = boatImages.map(
            (boatImage: BoatImageModel) => {
                return boatImage.image_path;
            }
        );

        return imagePaths;
    }

    /**
     * The following chunk is dedicated to requesting a singular boat with all their details.
     * @author Marcus K.
     */

    /**
     * A query that grabs a boat that matches the given ID, with the brand as well.
     * @param id is the id of a given boat.
     * @returns a Promise of a boat's data, or nothing at all if it can't find it.
     * @author Marcus K.
     */
    public async getMainData(id: number): Promise<BoatModel | null> {
        return await BoatModel.findOne({
            where: { id: id },
            include: {
                attributes: ['model', 'brandname'],
                model: BoatTypeModel
            }
        });
    }

    /**
     * A query that grabs all the Facilities that a boat with this ID has.
     * @param id is the id of a given boat.
     * @returns an array of facilities which match the id of a boat given.
     * @author Marcus K.
     */
    public async getFacilityData(id: number): Promise<BoatModel[] | null> {
        return await BoatModel.findAll({
            where: { id: id },
            include: {
                attributes: ['facility'],
                model: FacilityModel,
                through: { attributes: [] }
            }
        });
    }

    /**
     * A query that grabs all the Images that a boat with this ID has.
     * @param id is the id of a given boat.
     * @returns an array of images which match the id of a boat given.
     * @author Marcus K.
     */
    public async getImageData(id: number): Promise<BoatImageModel[] | null> {
        return await BoatImageModel.findAll({
            attributes: ['image_path'],
            where: {
                boat_id: id
            }
        });
    }

    /**
     * @function findOneBoat is technically not an accurate name, as it assembles all the data found for a boat. Still, it uses all found data to compile a boat instance.
     * @param returnedBoat are all the details about a boat.
     * @param returnedFacilities are all the facilities related to a boat.
     * @param returnedImages are all the images related to a boat.
     * @returns all those datapoints as one instanced boat.
     * @author Marcus K.
     */
    public async findOneBoat(
        returnedBoat: BoatModel,
        returnedFacilities: BoatModel[],
        returnedImages: BoatImageModel[]
    ): Promise<DetailedBoat | null> {
        let facilities: Promise<object[]> | undefined = undefined;
        if (returnedFacilities[0]) {
            facilities = this.arraySanitiser(returnedFacilities[0].facilities);
        }
        const images = this.arraySanitiser(returnedImages);

        /**
         * A modified instancer for boats, checking if core data returns at all and if the boat is active. If it goes well, it should get send back to the front.
         * Essentially converts it to a Business model, from what I've heard. But it somehow feels... off?
         * @author Marcus K.
         */
        if (returnedBoat && returnedBoat.active) {
            return new DetailedBoat(
                returnedBoat.id,
                returnedBoat.name,
                returnedBoat.description,
                returnedBoat.price_per_day_in_cents,
                returnedBoat.capacity,
                returnedBoat.license_required,
                returnedBoat.skipper_required,
                returnedBoat.model_id,
                returnedBoat.fabrication_year,
                returnedBoat.length_in_meters,
                returnedBoat.active,
                returnedBoat.boat_type_model
                    ? returnedBoat.boat_type_model.dataValues.model
                    : null,
                returnedBoat.boat_type_model
                    ? returnedBoat.boat_type_model.dataValues.brandname
                    : null,

                await facilities,
                await images
            );
        } else {
            return null;
        }
    }

    /**
     * @function arraySanitiser simply extracts all datavalues and pushes it into a new array
     * @param array is either the boatfacilities or images obtained here.
     * @returns an array with the datavalues extracted
     * @author Marcus K.
     */
    private async arraySanitiser(array: sanitiserModels): Promise<object[]> {
        const newArray: object[] = [];

        array.forEach(element => {
            newArray.push(element.dataValues);
        });

        return newArray.flat();
    }

    /**
     * The following chunk is dedicated to creating a brand new boat.
     * @author Marcus K.
     */

    /**
     * @method startTransaction just starts a new UNMANAGED transaction on sequelize.
     * @returns our newly created transaction
     * @author Marcus K.
     */
    public async startTransaction(): Promise<Transaction> {
        const sequelizeInstance: sequelize = SequelizeDatabaseConfig.sequelize;
        return await sequelizeInstance.transaction();
    }

    /**
     * @method endTransaction just commits our current sequelize transaction so it can end.
     * @param transaction is transaction you want to execute this method upon.
     * @author Marcus K.
     */
    public async endTransaction(transaction: Transaction): Promise<void> {
        await transaction.commit();
    }

    /**
     * @method transactionRollback gets rid of any changes we wanted to make with this transaction and aborts our sequelize transaction.
     * @param transaction is transaction you want to execute this method upon.
     * @author Marcus K.
     */
    public async transactionRollback(transaction: Transaction): Promise<void> {
        await transaction.rollback();
    }

    /**
     * @method createNewBoat takes the boatData and adds it onto the BoatModel in the database.
     * @param boatData an incoming boat object from the front end, asserted to the boat getting created.
     * @param transaction is the UNMANAGED transaction we're making it part of.
     * @returns a newly created boat in the database.
     * @author Marcus K.
     */
    public async createNewBoat(
        boatData: IncomingDetailedBoat,
        transaction: Transaction
    ): Promise<BoatModel> {
        return await BoatModel.create(
            {
                id: boatData.id,
                name: boatData.name,
                description: boatData.description,
                price_per_day_in_cents: boatData.price,
                capacity: boatData.capacity,
                license_required: boatData.licenseRequired,
                skipper_required: boatData.skipperRequired,
                model_id: boatData.modelId,
                fabrication_year: boatData.fabricationYear,
                length_in_meters: boatData.length,
                active: boatData.active
            },
            { transaction }
        );
    }

    /**
     * @method createFacilities maps out our facilities properly and one for one looks for them in the database or creates them.
     * @param facilityArray is a string array of facilities.
     * @param transaction is the UNMANAGED transaction we're making it part of.
     * @returns an array of found or newly created facilites.
     * @author Marcus K.
     */
    public async createFacilities(
        facilityArray: string[],
        transaction: Transaction
    ): Promise<FacilityModel[]> {
        const facilityObject: {
            facility: string;
        }[] = facilityArray.map((facility: string) => {
            return { facility: facility };
        });

        return await Promise.all(
            facilityObject.map(async facility => {
                const [facilityRow] = await FacilityModel.findOrCreate({
                    where: facility,
                    transaction
                });
                return facilityRow;
            })
        );
    }

    /**
     * @function assignFacilities tries to either find or create new Facilities, and then links them up with the newly created boat.
     * @param boatData an incoming boat object from the front end, used here to snatch the facilities from.
     * @param transaction is the UNMANAGED transaction we're making it part of.
     * @param newBoat is the newly created boat in the database we're creating an association to.
     * @author Marcus K.
     */
    public async assignFacilities(
        newBoat: BoatModel,
        transaction: Transaction,
        facilities: FacilityModel[]
    ): Promise<void> {
        await newBoat.addFacilities(facilities, { transaction });
    }

    /**
     * @function assignBrand simply creates a brand new brand and model in the database
     * @param boatData an incoming boat object from the front end, used here to snatch the brands and models from.
     * @param transaction is the UNMANAGED transaction we're making it part of.
     * @returns the ID of the newly created brand.
     * @author Marcus K.
     */
    public async assignBrand(
        brandModelData: {
            brandName: string;
            model: string;
        },
        transaction: Transaction
    ): Promise<DetailedBoat['modelId']> {
        /* How would one do type assertion on these? */
        const [boatTypeModel] = await BoatTypeModel.findOrCreate({
            where: brandModelData,
            transaction
        });

        return boatTypeModel.dataValues.id;
    }

    /**
     * @function assignImages creates a new set of images and assigns them the id of a boat.
     * @param boatData an incoming boat object from the front end, used here to snatch the image array from.
     * @param transaction is the UNMANAGED transaction we're making it part of.
     * @param newBoat is the newly created boat in the database we're getting the boat id from.
     * @author Marcus K.
     */
    public async assignImages(
        imageArray: string[],
        transaction: Transaction,
        newBoat: BoatModel
    ): Promise<void> {
        const imageObject: { boat_id: number; image_path: string }[] =
            imageArray.map((imagePath: string) => {
                return {
                    boat_id: newBoat.id,
                    image_path: imagePath
                };
            });

        await BoatImageModel.bulkCreate(imageObject, { transaction });
    }

    /**
     * @method getFacilities searches for all existing facilities and throws them in an array.
     * @returns an object array of boat facilities.
     * @author Marcus K.
     */
    private async getFacilities(): Promise<cleanedFacilities> {
        const facilities: FacilityModel[] = await FacilityModel.findAll();
        return facilities.map((facility: FacilityModel) => {
            return facility.dataValues;
        });
    }

    /**
     * @method getFacilities searches for all existing brand and types and throws them in an array.
     * @returns an object array of the boat brand and type.
     * @author Marcus K.
     */
    private async getBrandTypes(): Promise<cleanedModels> {
        const models: BoatTypeModel[] = await BoatTypeModel.findAll();
        return models.map((model: BoatTypeModel) => {
            return model.dataValues;
        });
    }

    /**
     * @method getBoatOptions gets pre existing many-to-many data so the user creating a boat in the front end can see and select options that already exist.
     * @returns an object with both facilityArrays and modelArrays.
     * @author Marcus K.
     */
    public async getBoatOptions(): Promise<{
        facilities: cleanedFacilities;
        models: cleanedModels;
    }> {
        try {
            const cleanedFacilities: cleanedFacilities =
                await this.getFacilities();
            const cleanedModels: cleanedModels = await this.getBrandTypes();

            return { facilities: cleanedFacilities, models: cleanedModels };
        } catch (error: unknown) {
            console.log(error);
            throw error;
        }
    }
}
