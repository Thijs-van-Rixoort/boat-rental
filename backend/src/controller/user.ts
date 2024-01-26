import express from 'express';
import { UserService } from '../business/service/user';
import { User, UserValidationErrors } from '../business/model/user';

/**
 * A class that contains all the methods that handle the logic for the user endpoints.
 * @author Thijs van Rixoort
 */
export class UserController {
    public constructor(private userService: UserService) {}

    /**
     * An endpoint that gives users the ability to update their account information.
     * @author Thijs van Rixoort
     */
    public async updateUserById(
        request: express.Request,
        response: express.Response
    ): Promise<void> {
        const updatedUserData = request.body;
        const loggedInUser: User = response.locals.user;
        let updatedUserOrValidationErrors: User | UserValidationErrors = {
            message: 'Er is een onbekende fout opgetreden.'
        };

        try {
            const user: User = User.createCompleteUser(
                undefined,
                undefined,
                updatedUserData.active,
                loggedInUser.id,
                updatedUserData.firstName,
                updatedUserData.preposition,
                updatedUserData.lastName,
                updatedUserData.mobileNumber,
                updatedUserData.city,
                updatedUserData.street,
                updatedUserData.houseNumber,
                updatedUserData.zipCode,
                undefined
            );

            updatedUserOrValidationErrors =
                await this.userService.updateUserById(user);

            if (updatedUserOrValidationErrors instanceof User) {
                response.status(201).json(updatedUserOrValidationErrors);
            } else {
                throw new Error(
                    'Er zijn fouten opgetreden bij het valideren van de gebruiker.'
                );
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(`Update User: ${error.message}`);
                response.status(400).json(updatedUserOrValidationErrors);
            }
        }
    }
}
