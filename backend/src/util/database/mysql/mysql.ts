import * as mysql2 from 'mysql2';

/**
 * @author Youri Janssen
 * A utility class for managing a MySQL connection pool for SQL-based database connections.
 */
export class MysqlDatabaseConfig {
    public static pool: mysql2.Pool;
    private static instance: MysqlDatabaseConfig | null = null;

    /**
     * @author Youri Janssen
     * Private constructor to prevent external instantiation.
     */
    private constructor() {
        MysqlDatabaseConfig.pool = this.createPool();
    }

    /**
     * @author Youri Janssen
     * Gets the singleton instance of the MysqlDatabaseConfig class.
     * If an instance doesn't exist, it creates one.
     * @returns {MysqlDatabaseConfig} The singleton instance of MysqlDatabaseConfig.
     * @designpattern Singleton
     */
    public static getInstance(): MysqlDatabaseConfig {
        if (!MysqlDatabaseConfig.instance) {
            MysqlDatabaseConfig.instance = new MysqlDatabaseConfig();
        }
        return MysqlDatabaseConfig.instance;
    }

    /**
     * @author Youri Janssen
     * Creates a MySQL connection pool using environment (.env) variables.
     * @returns {mysql2.Pool} The MySQL connection pool.
     */
    private createPool(): mysql2.Pool {
        return mysql2.createPool({
            host: process.env.HOST_RELATIONAL_DB,
            port: parseInt(process.env.PORT_RELATIONAL_DB || '3306', 10),
            user: process.env.USER_RELATIONAL_DB,
            password: process.env.PASSWORD_RELATIONAL_DB,
            database: process.env.SCHEMA_RELATIONAL_DB,
            waitForConnections: this.convertToBoolean(
                process.env.WAIT_FOR_CONNECTIONS_RELATIONAL_DB
            ),
            connectionLimit: parseInt(
                process.env.CONNECTION_LIMIT_RELATIONAL_DB || '10',
                10
            ),
            queueLimit: parseInt(
                process.env.QUEUE_LIMIT_RELATIONAL_DB || '0',
                10
            )
        });
    }

    /**
     * @author Youri Janssen
     * Converts a string input to a boolean value.
     * @param {string | undefined} input - The string to convert.
     * @returns {boolean} The converted boolean value.
     */
    private convertToBoolean(input: string | undefined): boolean {
        if (typeof input === 'string') {
            return input.toLowerCase() === 'true';
        }
        return false; // Default value if input is not a string
    }
}
