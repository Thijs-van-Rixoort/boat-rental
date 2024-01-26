import { Boat } from '../../business/model/boat';
import { Pool, RowDataPacket } from 'mysql2';
import {
    Connection,
    Pool as PoolPromise,
    RowDataPacket as RowDataPacketPromise
} from 'mysql2/promise';
import {
    DetailedBoat,
    IncomingDetailedBoat
} from '../../business/model/boat-detailed';
import { MysqlDatabaseConfig } from '../../util/database/mysql/mysql';
import { BoatDatabaseInterface } from '../interfaces/boat';
import { PoolConnection } from 'mysql2/typings/mysql/lib/PoolConnection';

/**
 * A class that implements the BoatDatabaseInterface for MySQL-based boat operations.
 * @implements {BoatDatabaseInterface}
 * @author Youri Janssen & Marcus K & Thijs van Rixoort
 */
export class BoatMysqlDatabase implements BoatDatabaseInterface {
    /**
     * Searches for boats in the MySQL database based on the provided name, limit and offset.
     * @param {string} name - The name to search for.
     * @param limit The result limit for the query.
     * @param offset The offset for the query results.
     * @returns {Promise<Boat[] | 'server_error'>} A Promise containing the search results or an error.
     * @author Youri Janssen & Thijs van Rixoort
     */
    public async searchBoats(
        name: string,
        limit: number,
        offset: number
    ): Promise<Boat[] | 'server_error'> {
        const pool: Pool | null = MysqlDatabaseConfig.pool;
        try {
            if (pool !== null) {
                const result: RowDataPacket[] = (
                    await pool
                        .promise()
                        .execute<RowDataPacket[]>(
                            'SELECT `boat`.*, GROUP_CONCAT(DISTINCT `facility`.`facility`) AS "facilities", GROUP_CONCAT(DISTINCT `boatimage`.`image_path`) AS "images" FROM `boat` LEFT JOIN `BoatFacility` ON `boat`.id = `BoatFacility`.`boat_id` LEFT JOIN `facility` ON `BoatFacility`.`facility_id` = `facility`.`id` LEFT JOIN `boatimage` ON `boat`.`id` = `boatimage`.`boat_id` WHERE `name` LIKE ? AND `active` = true GROUP BY `boat`.`id` ORDER BY `name` LIMIT ?, ?;',
                            [`%${name}%`, offset.toString(), limit.toString()]
                        )
                )[0];

                if (result.length === 0) {
                    return [];
                }

                const boats = await this.mapRowsToBoats(result);
                return boats;
            }
            return [];
        } catch (error) {
            console.log(error);
            return 'server_error';
        }
    }

    /**
     * @author Youri Janssen
     * Executes a query on the MySQL pool.
     * @param {Pool} pool - The MySQL pool.
     * @param {string} query - The SQL query to execute.
     * @param {any[]} parameters - The parameters for the query.
     * @returns {Promise<RowDataPacket[]>} A Promise containing the query results.
     */
    private async executeQueryFromPool(
        pool: Pool,
        query: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parameters: any[]
    ): Promise<RowDataPacket[]> {
        const [results] = await pool
            .promise()
            .execute<RowDataPacket[]>(query, parameters);
        return results;
    }

    /**
     * Maps the rows from the database to Boat objects.
     * @param {RowDataPacket[]} result - The database rows to map.
     * @param {Pool} pool - The MySQL pool.
     * @returns {Promise<Boat[]>} A Promise containing the mapped Boat objects.
     * @author Youri Janssen & Thijs van Rixoort
     */
    private async mapRowsToBoats(result: RowDataPacket[]): Promise<Boat[]> {
        const boats: Boat[] = [];
        for (const row of result) {
            const boat = Boat.createBoatWithId(
                row.id,
                row.name,
                row.price_per_day_in_cents,
                row.capacity,
                row.license_required,
                row.skipper_required,
                row.facilities !== null ? row.facilities.split(',') : [],
                row.images !== null ? row.images.split(',') : []
            );
            boats.push(boat);
        }
        return boats;
    }

    /**
     * The following chunk is dedicated to requesting a singular boat with all their details.
     * @author Marcus K.
     */

    /**
     * A execute that grabs a boat that matches the given ID
     * @param id is the id of a given boat.
     * @author Marcus K.
     */
    public async getMainData(id: number): Promise<RowDataPacket> {
        return (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<RowDataPacket[]>(
                    'SELECT boat.*, boatmodel.model, boatmodel.brandname FROM boat LEFT OUTER JOIN boatmodel ON boatmodel.id = boat.model_id where boat.id = ?;',
                    [id]
                )
        )[0][0];
    }

    /**
     * A execute that grabs all the Facilities that a boat with this ID has.
     * @param id is the id of a given boat.
     * @author Marcus K.
     */
    public async getFacilityData(id: number): Promise<RowDataPacket[]> {
        return (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<RowDataPacket[]>(
                    'SELECT facility FROM het_vrolijke_avontuur.boatfacility as b JOIN facility AS ba ON b.facility_id = ba.id where boat_id = ?',
                    [id]
                )
        )[0];
    }

    /**
     * A execute that grabs all the Images that a boat with this ID has.
     * @param id is the id of a given boat.
     * @author Marcus K.
     */
    public async getImageData(id: number): Promise<RowDataPacket[]> {
        return (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<RowDataPacket[]>(
                    'SELECT image_path FROM het_vrolijke_avontuur.boatimage where boat_id = ?;',
                    [id]
                )
        )[0];
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
        returnedBoat: RowDataPacket,
        returnedFacilities: RowDataPacket[],
        returnedImages: RowDataPacket[]
    ): Promise<DetailedBoat | null> {
        /**
         * A modified instancer for boats, checking if core data returns at all and if the boat is active. If it goes well, it should get send back to the front.
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

                returnedFacilities,
                returnedImages
            );
        } else {
            return null;
        }
    }

    /**
     * The following chunk is dedicated to creating a brand new boat.
     * @author Marcus K.
     */

    /**
     * @method startTransaction just starts a new UNMANAGED transaction on mysql.
     * @returns our newly created transaction
     * @author Marcus K.
     */
    public async startTransaction(): Promise<Connection> {
        const MySQLInstance: PoolPromise = MysqlDatabaseConfig.pool.promise();

        const connection: Connection = await MySQLInstance.getConnection(); //Note: Weird, It claims to be 'PoolConnection' but it doesn't like that type assertion??
        await connection.beginTransaction();

        return connection;
    }

    /**
     * @method endTransaction just commits and releases our current mysql transaction so it can end.
     * @param transaction is transaction you want to execute this method upon.
     * @author Marcus K.
     */
    public async endTransaction(connection: Connection): Promise<void> {
        await connection.commit();
        (connection as unknown as PoolConnection).release();
    }

    /**
     * @method transactionRollback gets rid of any changes we wanted to make with this transaction and aborts our mysql transaction.
     * @param transaction is transaction you want to execute this method upon.
     * @author Marcus K.
     */
    public async transactionRollback(connection: Connection): Promise<void> {
        await connection.rollback();
        (connection as unknown as PoolConnection).release();
        //Note: I would have all of these be type "PoolConnection" but I can't use standard .rollback() with that, and .end() instead of .release() is depricated until the next version.
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
        transaction: Connection
    ): Promise<DetailedBoat['modelId']> {
        await transaction.execute<RowDataPacketPromise[]>(
            'INSERT INTO `boatmodel` (`model`,`brandname`) SELECT ?, ? FROM boatmodel WHERE NOT EXISTS (SELECT id FROM `boatmodel` WHERE `model` = ? AND `brandname` = ?) LIMIT  1;',
            [
                brandModelData.model,
                brandModelData.brandName,
                brandModelData.model,
                brandModelData.brandName
            ]
        );

        return (
            (await transaction.execute<RowDataPacketPromise[]>(
                'SELECT * FROM boatmodel WHERE `model`= ? AND `brandname`= ? LIMIT 1;',
                [brandModelData.model, brandModelData.brandName]
            )) as RowDataPacketPromise
        )[0][0].id;
    }

    /**
     * @function createNewBoat takes the boatData and adds it onto the BoatModel in the database during the transaction
     * @param boatData an incoming boat object from the front end, asserted to the boat getting created.
     * @param transaction is the UNMANAGED transaction we're making it part of.
     * @returns a newly created boat id in the database.
     * @author Marcus K.
     */

    public async createNewBoat(
        boatData: IncomingDetailedBoat,
        transaction: Connection
    ): Promise<DetailedBoat['id']> {
        const cool: DetailedBoat['id'] = (
            (await transaction.execute<RowDataPacketPromise[]>(
                'INSERT INTO `Boat` (`id`,`name`,`price_per_day_in_cents`,`capacity`,`license_required`,`skipper_required`,`model_id`,`fabrication_year`,`length_in_meters`,`description`,`active`) VALUES (?,?,?,?,?,?,?,?,?,?,?);',
                [
                    boatData.id,
                    boatData.name,
                    boatData.price,
                    boatData.capacity,
                    boatData.licenseRequired,
                    boatData.skipperRequired,
                    boatData.modelId,
                    boatData.fabricationYear,
                    boatData.length,
                    boatData.description,
                    boatData.active
                ]
            )) as RowDataPacketPromise
        )[0].insertId; //Note: The 'as RowDataPacketPromise' is essentially me telling TS that I know better than it, kinda a bad move.
        return cool;
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
        transaction: Connection
    ): Promise<number[]> {
        const newFacilityIds = await Promise.all(
            facilityArray.map(async (facility: string) => {
                await transaction.execute<RowDataPacketPromise[]>(
                    'INSERT INTO `facility` (`facility`) SELECT ? FROM facility WHERE NOT EXISTS (SELECT id FROM `facility` WHERE `facility` = ?) LIMIT  1;',
                    [facility, facility]
                );

                //Note: This exists instead of taking advantage of the ResultSetHeader because if it already exists, the insertId will be 0
                const newFacilityId: number = (
                    (await transaction.execute<RowDataPacketPromise[]>(
                        'SELECT * FROM facility WHERE `facility`= ? LIMIT 1;',
                        [facility]
                    )) as RowDataPacketPromise
                )[0][0].id;

                return newFacilityId;
            })
        );
        return newFacilityIds;
    }

    /**
     * @function assignFacilities tries to either find or create new Facilities, and then links them up with the newly created boat.
     * @param boatData an incoming boat object from the front end, used here to snatch the facilities from.
     * @param transaction is the UNMANAGED transaction we're making it part of.
     * @param newBoat is the newly created boat in the database we're creating an association to.
     * @author Marcus K.
     */
    public async assignFacilities(
        newBoatId: DetailedBoat['id'],
        transaction: Connection,
        facilities: number[]
    ): Promise<void> {
        await Promise.all(
            facilities.map(async (FacilityId: number) => {
                console.log(newBoatId, FacilityId);
                await transaction.execute(
                    'INSERT INTO `Boatfacility` (`boat_id`,`facility_id`) VALUES (?,?);',
                    [newBoatId, FacilityId]
                );
            })
        );
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
        transaction: Connection,
        newBoatId: DetailedBoat['id']
    ): Promise<void> {
        //Note: Putting this in a Promise.all so that the error is moved up and properly caught by the transaction system.
        await Promise.all(
            imageArray.map(async (image: string) => {
                await transaction.execute<RowDataPacketPromise[]>(
                    'INSERT INTO `BoatImage` (`boat_id`,`image_path`) VALUES (?, ?);',
                    [newBoatId, image]
                );
            })
        );
    }

    /**
     * @method getBoatOptions gets pre existing many-to-many data so the user creating a boat in the front end can see and select options that already exist.
     * @returns an object with both facilityArrays and modelArrays.
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
        const facilities: {
            id: number;
            facility: string;
        }[] = (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<RowDataPacket[]>(
                    'SELECT `id`, `facility` FROM `Facility` AS `FacilityModel`'
                )
        )[0] as {
            id: number;
            facility: string;
        }[];

        const brandModels: {
            id: number;
            model: string;
            brandname: string;
        }[] = (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<RowDataPacket[]>(
                    'SELECT `id`, `model`, `brandname` FROM `Boatmodel` AS `BoatTypeModel`'
                )
        )[0] as {
            id: number;
            model: string;
            brandname: string;
        }[];

        return {
            facilities: facilities,
            models: brandModels
        };
    }
}
