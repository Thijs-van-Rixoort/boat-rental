import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { MysqlDatabaseConfig } from '../../util/database/mysql/mysql';

import { UserDatabaseInterface } from '../interfaces/user';
import { User as BusinessUser } from '../../business/model/user';

/**
 * A data access object for the user table in our database.
 * @author Thijs van Rixoort
 */
export class UserMysqlDatabase implements UserDatabaseInterface {
    /**
     * Gets a user from the database by using their email address.
     * @param email The email address of the user you want to retrieve.
     * @returns the user if the email is found in the user table, else null.
     * @author Thijs van Rixoort
     */
    public async getUserByEmail(email: string): Promise<BusinessUser> {
        const results: RowDataPacket[] = (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<RowDataPacket[]>(
                    'SELECT * FROM `user` WHERE email = ?',
                    [email]
                )
        )[0];

        if (results[0] === undefined) {
            throw new Error('Het e-mailadres of wachtwoord klopt niet.');
        }

        return this.convertRowDataPacketToBusinessUser(results[0]);
    }

    /**
     * Updates an existing user in the database.
     * @param user the User object that you want to update in the database.
     * @author Thijs van Rixoort
     */
    public async updateUserById(user: BusinessUser): Promise<BusinessUser> {
        const results: ResultSetHeader = (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<ResultSetHeader>(
                    'UPDATE `user` SET `first_name` = ?, `preposition` = ?, `last_name` = ?, `mobile_number` = ?, `city` = ?, `street` = ?, `house_number` = ?, `zip_code` = ?, `active` = ? WHERE `id` = ?;',
                    [
                        user.firstName,
                        user.preposition,
                        user.lastName,
                        user.mobileNumber,
                        user.city,
                        user.street,
                        user.houseNumber,
                        user.zipCode,
                        user.active,
                        user.id
                    ]
                )
        )[0];

        if (results.affectedRows === 0) {
            throw new Error('De gebruiker kon niet worden aagepast.');
        }

        return user;
    }

    /**
     * Gets a user fro the database by using their login session id.
     * @param sessionId The session id.
     * @returns the user when it is found in the database.
     * @author Thijs van Rixoort
     */
    public async getUserBySessionId(sessionId: string): Promise<BusinessUser> {
        const results: RowDataPacket[] = (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<RowDataPacket[]>(
                    'SELECT * FROM `session` LEFT OUTER JOIN `user` ON `session`.`user_id` = `user`.`id` WHERE `session`.id = ?',
                    [sessionId]
                )
        )[0];

        if (results[0] === undefined) {
            throw new Error('Deze gebruiker is niet ingelogd.');
        }

        return this.convertRowDataPacketToBusinessUser(results[0]);
    }

    /**
     * Converts a RowDataPacket to a business model of a user.
     * @param userData The user data in a RowDataPacket.
     * @returns the BusinessUser object containing the data of the RowDataPacket.
     * @author Thijs van Rixoort
     */
    private convertRowDataPacketToBusinessUser(
        userData: RowDataPacket
    ): BusinessUser {
        return BusinessUser.createUserWithId(
            userData.id,
            userData.email,
            userData.password,
            userData.type,
            userData.active
        );
    }

    /**
     * @method getUserTypeMySQL is simply the queries to find the type of user within the database.
     * @param sessionToken is the user session token given with the cookie itself
     * @returns either a string with the type, or nothing at all
     * @author Marcus K.
     */
    public async getUserType(sessionToken: string): Promise<string | null> {
        const userType: RowDataPacket = (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<RowDataPacket[]>(
                    'SELECT type FROM het_vrolijke_avontuur.user where id = (SELECT user_id FROM het_vrolijke_avontuur.session where id = ?) limit 1',
                    [sessionToken]
                )
        )[0][0];

        return userType.type;
    }
}
