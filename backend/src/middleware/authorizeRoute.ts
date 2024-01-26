import { NextFunction, Request, Response } from 'express';

/**
 * A simple middleware class usually bound to a Router-Level Middleware function, containing methods to quickly and easily add authorization to existing routes.
 * Currently only has isUserType, which just simply checks the incoming usertype and compares it to a given array.
 * @author Marcus K.
 */
export class AuthorizeRoute {
    /**
     * @method isAdmin sends the request off to see if the user is of the given type. If this does not come back, the connection gets closed with an (401) Unauthorised.
     * @param preferredUserType is a stringArray which contains whichever type of user you want to access this endpoint.
     * @param request is the incoming request from the user we use to get the usertype from.
     * @param response is the response which gets send back closed off if the user is not authorised to access this endpoind.
     * @param next simply calls the next Middleware to be run. In theory this is completely unnecessary but kept for potential future uses.
     * @author Marcus K.
     */

    /**
     * @method isUserType is our Authorization method for checking if the incoming userType matches the types allowed on the attached endpoint.
     * It looks in the response.locals for the userType, as the getInitialData Middleware has overwritten this to either have one or none.
     * @param preferredUserType is a string[] containing all the types of users allowed on this route.
     * @returns
     */
    public isUserType = (preferredUserType: string[]) => {
        return async (
            _request: Request,
            response: Response,
            next: NextFunction
        ): Promise<void> => {
            const userType: string | null = response.locals.userType;

            if (userType && preferredUserType.includes(userType)) {
                next();
            } else {
                response
                    .status(401)
                    .json('You Are Not Authorized To Access This Endpoint');
            }
        };
    };
}
