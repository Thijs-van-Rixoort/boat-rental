import { NextFunction, Request, Response } from 'express';
import { SessionService } from '../business/service/session';
import { DatabaseInterface } from '../data/interfaces/database';
import { MySQLDatabase } from '../data/mysql/database';
import { SequelizeDatabase } from '../data/sequelize/database';

/**
 * A simple middleware class to (currently) check if the user is of the given userType or not.
 * Preferrably I'd use the service and data layers for this, but that would be sucky to implement, plus most sources have the query in the middleware itself anyway??
 * @author Marcus K.
 */
export class GetUserType {
    /** == A copy of the one made by Thijs, this way I can actually use it anywhere, Theorethically I could make his public, but I'm afraid it might mess with things? -Marcus ==
     * Initializes the LoginController with the correct database implementation.
     * @author Thijs van Rixoort
     */
    private initLoginController(): SessionService {
        let database: DatabaseInterface;

        if (process.env.DB_TYPE === 'sql') {
            database = new MySQLDatabase();
        } else {
            database = new SequelizeDatabase();
        }

        const usedService: SessionService = new SessionService(database);

        return usedService;
    }

    /**
     * @method getUserType is dedicated to retrieving the user type from the database and storing it in our locals, so it can be used by other middleware!
     * @param request is the incoming request from the user we use to get the session_token from to get the userType with.
     * @param response is the response of which we modify the locals on so we can store our userType on it.
     * @param next simply calls the next Middleware to be run.
     * @returns this function, with a Promise of void.
     * @author Marcus K.
     */
    public getUserType = () => {
        return async (
            request: Request,
            response: Response,
            next: NextFunction
        ): Promise<void> => {
            const cookie: string = request.cookies['session_token'];
            /**
             * response.locals is specifically designed for storing data now for later usage elsewhere. None of it goes to the client either, despite it being on the response.
             * Apart from storing it directly on the request object itself, this is the best option out there for sharing data like this.
             * However, Express *can* be used to render a view with a template, which uses our locals to set that up.
             * So if you're using this, do NOT store sensitive data in here like session tokens or passwords. I'm only storing our userType or undefined here.
             */

            response.locals.userType = cookie
                ? await this.initLoginController().getUserType(cookie)
                : undefined;

            next();
        };
    };
}
