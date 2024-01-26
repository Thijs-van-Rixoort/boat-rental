import express, { Request, Response, Router } from 'express';
import { RegisterController } from '../../controller/register';

/**
 * @author Youri Janssen
 * Class for managing register-related routes.
 */
export class RegisterRoutes {
    private router: Router = express.Router();

    /**
     * @author Youri Janssen
     * Creates an instance of RegisterRoutes.
     * @param {RegisterController} registerController - The controller for managing registration-related actions.
     */
    constructor(private registerController: RegisterController) {
        this.setupRoutes();
    }

    /**
     * @author Youri Janssen
     * Set up all register-related routes.
     */
    private setupRoutes(): void {
        this.router.post('/', this.createUser);
    }

    /**
     * @author Youri Janssen
     * Handles the creation of a new user.
     * @param {Request} request - The Express request object.
     * @param {Response} response - The Express response object.
     */
    private createUser = (request: Request, response: Response): void => {
        this.registerController.createUser(request, response);
    };

    /**
     * @author Youri Janssen
     * @returns {Router} The Express router for register-related routes.
     */
    public getRegisterRouter(): Router {
        return this.router;
    }
}
