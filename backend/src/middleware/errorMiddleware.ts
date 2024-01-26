import { Request, Response, NextFunction } from 'express';

//Mostly just added this as we haven't had one before, but we really could use it.
export class ErrorMiddleware {
    /**
     * After being aware of Error-handling middleware's existance, I've added this in case someone fails to catch something properly to prevent the entire application from crashing.
     * Preferrably no one should rely on this as this bastion is mostly meant as our last resort against stupidity.
     * @param error is the error that occurs if something goes wrong on a Router-Level middleware
     * @param _request is our unused request object, just here to make sure that the application passes values through correctly.
     * @param response is our response, informing the user that a major screw-up happened *somewhere* but hasn't been caught anywere.
     * @param next calls in the next Middleware in line.
     * @author Marcus K.
     */
    /* I'll finally agree that not *EVERY* arrow function needs typing, otherwise this will be a massive mess. => This is an arrow function due to PathParams */
    public failsafe = () => {
        return async (
            error: Error,
            _request: Request,
            response: Response,
            next: NextFunction
        ) => {
            if (!error) {
                next();
            } else {
                console.error(error.stack);
                response
                    .status(500)
                    .send(
                        'Something Went Horribly Wrong and Did Not Get Caught Properly! Report This to the System Administrator.'
                    );
            }
        };
    };
}
