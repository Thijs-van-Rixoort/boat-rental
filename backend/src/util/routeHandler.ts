import express, { Router } from 'express';
import { RegisterController } from '../controller/register';
import { RegisterRoutes } from './routes/register';
import { SessionService } from '../business/service/session';
import { SessionController } from '../controller/session';
import { SessionRoutes } from './routes/session';
import { BoatRoutes } from './routes/boat';
import { RegisterService } from '../business/service/register';
import { UserRoutes } from './routes/user';
import { UserService } from '../business/service/user';
import { UserController } from '../controller/user';
import { DatabaseInterface } from '../data/interfaces/database';
import { MySQLDatabase } from '../data/mysql/database';
import { SequelizeDatabase } from '../data/sequelize/database';

/**
 * @author Youri Janssen
 * Handles the initialization and assignment of routes for the Express application.
 * @designpattern Factory Pattern - The Factory pattern is used to create objects based on certain conditions. In this case, the initialization of different types of controllers and databases based on the environment variable is managed by the Factory pattern.
 */
export class RouteHandler {
    private _router: Router = express.Router();
    private _database!: DatabaseInterface;

    public get router(): Router {
        return this._router;
    }

    /**
     * @author Youri Janssen
     * Creates a new instance of the RouteHandler class
     */
    constructor() {
        this.initDatabase();
        this.testRoute();
        this.initRegisterRoutes();
        this.initSessionRoutes();
        this.initUserRoutes();
        this.initBoatRoutes();
    }

    /**
     * Initializes the database object that is used in the services.
     * @author Thijs van Rixoort
     */
    private initDatabase(): void {
        switch (process.env.DB_TYPE) {
            case 'sql':
                this._database = new MySQLDatabase();
                break;
            case 'sequelize':
                this._database = new SequelizeDatabase();
                break;
            default:
                throw new Error(
                    'A database implementation should be specifed.'
                );
        }
    }

    /**
     * @author Youri Janssen
     * Configures a test route for checking server health.
     */
    private testRoute(): void {
        this.router.get('/ping', (req, res) => {
            res.status(200).json('pong');
        });
    }

    /**
     * @author Youri Janssen
     * Loads route for the register controller.
     */
    private initRegisterRoutes(): void {
        const service: RegisterService = new RegisterService(this._database);
        const controller: RegisterController = new RegisterController(service);

        this.router.use(
            '/register',
            new RegisterRoutes(controller).getRegisterRouter()
        );
    }

    /**
     * Initializes the endpoints for the session functionality.
     * @author Thijs van Rixoort
     */
    private initSessionRoutes(): void {
        const service: SessionService = new SessionService(this._database);
        const controller: SessionController = new SessionController(service);

        this.router.use('/sessions', new SessionRoutes(controller).getRouter());
    }

    /**
     * Gets the Express Router instance with the application's routes loaded.
     * @returns {Router} The Express Router instance.
     * @function boatsRoutes() very simply sets up the route for boats related content.
     * @author Marcus K && Youri Janssen.
     */
    private initBoatRoutes(): void {
        this.router.use('/boat', new BoatRoutes().assignRoutes());
    }

    /**
     * Initializes the endpoints for the user functionality.
     * @author Thijs van Rixoort
     */
    private initUserRoutes(): void {
        const service: UserService = new UserService(this._database);
        const controller: UserController = new UserController(service);

        this.router.use('/users', new UserRoutes(controller).getRouter());
    }
}
