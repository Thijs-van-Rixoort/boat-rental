import express from 'express';
import cookieParser from 'cookie-parser';
import { MysqlDatabaseConfig } from './util/database/mysql/mysql';
import { SequelizeDatabaseConfig } from './util/database/sequelize/sequelize';
import { RouteHandler } from './util/routeHandler';
import { GetUserType } from './middleware/initialData';
import { ErrorMiddleware } from './middleware/errorMiddleware';

/**
 * The main server class responsible for setting up the Express server.
 * @author Youri Janssen & Thijs van Rixoort
 */
class Server {
    private static instance: Server | null = null;
    private _app: express.Application;

    /**
     * @author Youri Janssen
     * Get the Express application instance.
     */
    public get app(): express.Application {
        return this._app;
    }

    private port: number;
    private database: MysqlDatabaseConfig | SequelizeDatabaseConfig;
    private routeHandler: RouteHandler = new RouteHandler();
    private getUserType: GetUserType = new GetUserType();
    private errorMiddleware: ErrorMiddleware = new ErrorMiddleware();

    /**
     * @author Youri Janssen
     * Creates a new Server instance.
     */
    private constructor() {
        this._app = express();

        /* The port number on which the server will listen. */
        this.port = parseInt(process.env.PORT || '3002', 10);

        /* Use an environment variable to determine if it's test mode */
        const isTestMode = process.env.TEST_MODE === 'true';

        /* Depending on the mode, set the database instance */
        if (isTestMode || process.env.DB_TYPE !== 'sql') {
            this.database = SequelizeDatabaseConfig.getInstance();
        } else {
            this.database = MysqlDatabaseConfig.getInstance();
        }

        /* Configure middleware and route handler. */
        this.configureMiddleware();
        this.configureRouteHandler();

        /* Conditionally execute syncDatabase based on test mode */
        if (this.database instanceof MysqlDatabaseConfig) {
            this.startServer();
        } else {
            /**
             * Modified 'testMode' in a way that only disables Sync.
             */
            this.startServerWithDatabaseSync(isTestMode);
        }
    }

    /**
     * A method to enforce the singleton design pattern, which is useful for this class since only one instance is needed.
     * @returns the instance of the Server class.
     * @author Thijs van Rixoort
     */
    public static getInstance(): Server {
        if (Server.instance === null) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    /**
     * @author Youri Janssen
     * Configures middleware for the Express app.
     */
    private configureMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        /* CORS headers configuration */
        this.app.use((req, res, next) => {
            res.setHeader(
                'Access-Control-Allow-Origin',
                'http://localhost:4200'
            );
            res.setHeader(
                'Access-Control-Allow-Methods',
                'GET, POST, OPTIONS, PUT, PATCH, DELETE'
            );
            res.setHeader(
                'Access-Control-Allow-Headers',
                'X-Requested-With,content-type'
            );
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });

        /* A cookie parser so we can read and use cookies from requests */
        this.app.use(cookieParser());

        /* A simple middleware method which uses the cookie to return a user's type */
        this.app.use(this.getUserType.getUserType());

        /* A simple middleware method that gets called on any completely uncaught errors, as our last line of defense */
        this.app.use(this.errorMiddleware.failsafe());
    }

    /**
     * @author Youri Janssen
     * Assigns the route handler for the Express app.
     */
    private configureRouteHandler() {
        this.app.use(this.routeHandler.router);
    }

    private async startServerWithDatabaseSync(testMode: boolean) {
        /* Synchronize the database before starting the server if it's a Sequelize database. */
        if (this.database instanceof SequelizeDatabaseConfig) {
            await this.database.syncDatabase(testMode);
        }

        this.startServer();
    }
    /**
     * @author Youri Janssen
     * Starts the Express server.
     */
    public async startServer() {
        /* Start the Express server.*/
        this.app.listen(this.port, () => {
            let databaseType;
            if (this.database instanceof MysqlDatabaseConfig) {
                databaseType = 'MySQL';
            } else {
                databaseType = 'Sequelize';
            }
            let testMode;
            if (process.env.TEST_MODE === 'true') {
                testMode = 'true';
            } else {
                testMode = 'false';
            }
            console.log(
                `Server is running on localhost:${this.port} using ${databaseType} in test mode: ${testMode}`
            );
        });
    }
}

/* The server instance. */
export const SERVER: Server = Server.getInstance();
