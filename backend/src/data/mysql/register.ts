import { RegisterDatabaseInterface } from '../interfaces/register';
import { Roles, User } from '../../business/model/user';
import { FieldPacket, Pool, ResultSetHeader, RowDataPacket } from 'mysql2';
import { MysqlDatabaseConfig } from '../../util/database/mysql/mysql';

/**
 * @author Youri Janssen
 * A class that implements the RegisterDatabaseInterface for MySQL-based registration operations.
 * @implements {RegisterDatabaseInterface}
 */
export class RegisterMysqlDatabase implements RegisterDatabaseInterface {
    /**
     * @author Youri Janssen
     * Creates a new user with the provided email and password in the MySQL database.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise<boolean>} A Promise that resolves with `true` if successful, or `false` if an error occurs.
     * @designpattern Singleton Pattern, Dependency Injection (DI) Pattern
     * The method utilizes the Singleton pattern by accessing the MySQL connection pool through the MysqlDatabaseConfig class, ensuring a single instance of the connection pool is used throughout the application. Additionally, the Dependency Injection pattern is employed for the Pool object, promoting loose coupling and enhancing code modularity and testability.
     */
    public async createUser(
        email: string,
        password: string,
        type: Roles,
        active: number
    ): Promise<boolean> {
        const pool: Pool | null = MysqlDatabaseConfig.pool;

        if (pool != null) {
            try {
                const [result]: [ResultSetHeader, FieldPacket[]] = await pool
                    .promise()
                    .execute<ResultSetHeader>(
                        'INSERT INTO `user` (`email`, `password`, `type`, `active`) VALUES (?, ?, ?, ?)',
                        [email, password, type, active] // Use the hashed password
                    );

                if (result && result.affectedRows > 0) {
                    return true;
                }
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }

        return false;
    }

    /**
     * @author Youri Janssen
     * Find a user by email address in the MySQL database.
     * @param {string} email - The email address to search for.
     * @returns {Promise<User | null>} A Promise that resolves with the user if found, or `null` if not found.
     */
    public async getUserByMail(email: string): Promise<User | null> {
        const pool: Pool | undefined = MysqlDatabaseConfig.pool;

        if (pool !== null) {
            try {
                const [rows]: [RowDataPacket[], FieldPacket[]] = await pool
                    .promise()
                    .query<RowDataPacket[]>(
                        'SELECT * FROM `user` WHERE `email` = ? LIMIT 1',
                        [email]
                    );

                if (rows.length > 0) {
                    const userData: RowDataPacket = rows[0];
                    return User.createUser(
                        userData.email,
                        userData.password,
                        userData.type,
                        userData.active
                    );
                }
            } catch (error) {
                console.error('Error fetching user by email:', error);
            }
        }

        return null;
    }
}
