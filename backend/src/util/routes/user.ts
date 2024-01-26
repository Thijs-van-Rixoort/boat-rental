import express, { Request, Response, Router } from 'express';
import { UserController } from '../../controller/user';
import { AuthenticationMiddleware } from '../../middleware/authentication';

/**
 * A class that contains all the user routes in a router attribute.
 * @author Thijs van Rixoort
 */
export class UserRoutes {
    private router: Router = express.Router();

    constructor(private userController: UserController) {
        this.setupRoutes();
    }

    /**
     * Sets up all the user routes in the router attribute.
     * @author Thijs van Rixoort
     */
    private setupRoutes(): void {
        this.router.put(
            '/',
            AuthenticationMiddleware.getInstance().authenticateUser(),
            this.updateUserById.bind(this)
        );
    }

    /**
     * An endpoint method that makes users able to change their account information.
     * @param request The express Request object.
     * @param response The express Response object.
     * @author Thijs van Rixoort
     */
    private updateUserById(request: Request, response: Response): void {
        this.userController.updateUserById(request, response);
    }

    /**
     * Returns the router attribute from this class.
     * @returns the login router with all the initialized user routes.
     * @author Thijs van Rixoort
     */
    public getRouter(): Router {
        return this.router;
    }
}
