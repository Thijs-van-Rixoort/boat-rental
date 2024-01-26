import { NextFunction, Request, Response } from 'express';
import { AuthenticationService } from '../business/service/authentication';
import { UserDatabaseInterface } from '../data/interfaces/user';
import { UserMysqlDatabase } from '../data/mysql/user';
import { UserSequelizeDatabase } from '../data/sequelize/user';
import { User } from '../business/model/user';

/**
 * Some simple authentication middleware that can be added to individual endpoints if authentication is needed in a route.
 * @author Thijs van Rixoort
 */
export class AuthenticationMiddleware {
    private static instance: AuthenticationMiddleware | null = null;
    private authenticationService!: AuthenticationService;

    private constructor() {
        this.initAuthenticationService();
    }

    /**
     * Creates an instance of the AuthenticationMiddleware class if it doesn't exist.
     * @returns the instance of this class.
     * @author Thijs van Rixoort
     */
    public static getInstance(): AuthenticationMiddleware {
        if (AuthenticationMiddleware.instance === null) {
            AuthenticationMiddleware.instance = new AuthenticationMiddleware();
        }
        return AuthenticationMiddleware.instance;
    }

    /**
     * Initializes the service this middleware uses.
     * @author Thijs van Rixoort
     */
    private initAuthenticationService(): void {
        let userDatabase: UserDatabaseInterface;

        if (process.env.DB_TYPE === 'sql') {
            userDatabase = new UserMysqlDatabase();
        } else {
            userDatabase = new UserSequelizeDatabase();
        }

        const usedService: AuthenticationService = new AuthenticationService(
            userDatabase
        );

        this.authenticationService = usedService;
    }

    /**
     * A method that checks a request for a cookie with a session id.
     * If the session id is present, the user will be retrieved from the database and the next middleware will be called.
     * If there is no session id, or it is not found in the database, a response is sent back with the message that you're not logged in.
     * @author Thijs van Rixoort
     */
    public authenticateUser = () => {
        return async (
            request: Request,
            response: Response,
            next: NextFunction
        ): Promise<void> => {
            const sessionId: string = request.cookies['session_token'];
            let user: User | undefined = undefined;

            try {
                user =
                    await this.authenticationService.authenticateUser(
                        sessionId
                    );

                response.locals.user = user;

                next();
            } catch (error: unknown) {
                response.status(401).json({
                    message: 'U bent niet ingelogd.'
                });
            }
        };
    };
}
