import { DatabaseInterface } from '../../data/interfaces/database';
import { User, UserValidationErrors } from '../model/user';

/**
 * A class that handles the data traffic and business logic of users.
 * @author Thijs van Rixoort
 */
export class UserService {
    public constructor(private _database: DatabaseInterface) {}

    /**
     * Updates a user after validating the requested values.
     * @param user A User object of which the values are validated and then updated in an existing database entry.
     * @returns the updated user object, or an object containing all the validation errors.
     * @author Thijs van Rixoort
     */
    public async updateUserById(
        user: User
    ): Promise<User | UserValidationErrors> {
        let returnValue: User | UserValidationErrors;

        if (user.isValid()) {
            returnValue = await this._database.user.updateUserById(user);
        } else {
            returnValue = user.validationErrors;
        }

        return returnValue;
    }
}
