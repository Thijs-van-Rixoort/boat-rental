import { Roles, User } from '../../business/model/user';
import { UserModel } from '../../util/database/sequelize/models/user';
import { RegisterDatabaseInterface } from '../interfaces/register';

/**
 * @author Youri Janssen
 * Represents a Sequelize-based database implementation for user registration.
 */
export class RegisterSequelizeDatabase implements RegisterDatabaseInterface {
    /**
     * @author Youri Janssen
     * Creates a new user with the provided email and password in the SQL database.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @param {Roles} type - The user's role.
     * @param {number} active - The user's active status.
     * @returns {Promise<boolean>} A Promise that resolves to `true` if the user was created successfully, or `false` on failure.
     */
    public async createUser(
        email: string,
        password: string,
        type: Roles,
        active: number
    ): Promise<boolean> {
        try {
            await UserModel.create({
                email,
                password,
                type,
                active
            } as UserModel);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * @author Youri Janssen
     * Find a user by email address.
     * @param {string} email - The email address to search for.
     * @returns {Promise<User | null>} A Promise that resolves with the user if found, or `null` if not found.
     */
    public async getUserByMail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({
            where: {
                email: email
            }
        });
        if (user === null) {
            return null;
        }
        return User.createUser(
            user.email,
            user.password,
            user.type,
            user.active
        );
    }
}
