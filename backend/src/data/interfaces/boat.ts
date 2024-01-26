import { RowDataPacket } from 'mysql2';
import { Boat } from '../../business/model/boat';
import { BoatModel } from '../../util/database/sequelize/models/boat';
import BoatImageModel from '../../util/database/sequelize/models/boatimage';
import {
    DetailedBoat,
    IncomingDetailedBoat
} from '../../business/model/boat-detailed';
import { Transaction } from 'sequelize';
import { FacilityModel } from '../../util/database/sequelize/models/facility';
import { Connection } from 'mysql2/promise';

export type ExpectedCreateBody = {
    name: string;
    price: number;
    capacity: number;
    licenseRequired: boolean;
    skipperRequired: boolean;

    id?: number;
    description?: string;
    fabricationYear?: number;
    length?: number;
    active?: boolean;
    model?: string;
    brandName?: string;

    modelId?: number;
    facilityArray?: Array<string>;
    imageArray?: Array<string>;
};

/**
 * An interface for managing boat-related database operations.
 * @author Youri Janssen & Marcus K & Thijs van Rixoort
 */
export interface BoatDatabaseInterface {
    searchBoats(
        name: string,
        limit: number,
        offset: number
    ): Promise<Boat[] | 'server_error'>;

    /**
     * This chunk of the interface is dedicated to getting even more specific data about a sIngular boat.
     */

    findOneBoat(
        returnedBoat: RowDataPacket | BoatModel | null,
        returnedFacilities: RowDataPacket[] | BoatModel[] | null,
        returnedImages: RowDataPacket[] | BoatImageModel[] | null
    ): Promise<DetailedBoat | null>;

    getMainData(id: number): Promise<RowDataPacket | BoatModel | null>;

    getFacilityData(id: number): Promise<RowDataPacket[] | BoatModel[] | null>;

    getImageData(
        id: number
    ): Promise<RowDataPacket[] | BoatImageModel[] | null>;

    /**
     * The following chunk of the interface is dedicated to creating a brand new boat.
     */

    assignBrand(
        brandModelData: {
            brandName: string;
            model: string;
        },
        transaction: Connection | Transaction
    ): Promise<DetailedBoat['modelId']>;

    createNewBoat(
        boatData: IncomingDetailedBoat,
        transaction: Connection | Transaction
    ): Promise<BoatModel | DetailedBoat['id']>;

    createFacilities(
        facilityArray: string[],
        transaction: Connection | Transaction
    ): Promise<FacilityModel[] | number[]>;

    assignFacilities(
        newBoatId: BoatModel | IncomingDetailedBoat['id'],
        transaction: Connection | Transaction,
        facilities: FacilityModel[] | number[]
    ): Promise<void>;

    assignImages(
        imageArray: string[],
        transaction: Connection | Transaction,
        newBoatId: BoatModel | IncomingDetailedBoat['id']
    ): Promise<void>;

    startTransaction(): Promise<Connection | Transaction>;

    endTransaction(transaction: Connection | Transaction): Promise<void>;

    transactionRollback(connection: Connection | Transaction): Promise<void>;

    getBoatOptions(): Promise<{
        facilities: {
            id: number;
            facility: string;
        }[];
        models: {
            id: number;
            model: string;
            brandname: string;
        }[];
    }>;
}
