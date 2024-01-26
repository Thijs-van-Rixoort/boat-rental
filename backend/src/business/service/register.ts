import { DatabaseInterface } from '../../data/interfaces/database';
import { User, Roles } from '../model/user';

/**
 * @author Youri Janssen
 * Service class for managing registration-related operations.
 */
export class RegisterService {
    /**
     * @author Youri Janssen
     * Creates an instance of RegisterService.
     * @param {RegisterDatabaseInterface} _database.register - The database interface for registration-related database operations.
     * @designpattern Dependency Injection (DI)
     */
    public constructor(private _database: DatabaseInterface) {}

    /**
     * @author Youri Janssen
     * Hashes the provided password.
     * @param {string} password - The password to be hashed.
     * @returns {Promise<string>} A Promise that resolves with the hashed password.
     */
    private async hashPassword(password: string): Promise<string> {
        const hashedPassword = await User.hashPassword(password);
        return hashedPassword;
    }

    /**
     * @author Youri Janssen
     * Creates a new user and registers them in the system.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise<boolean | string[] | 'user_exists'>} A Promise that resolves to one of the following:
     *   - `true` if the user was created successfully.
     *   - An array of validation error messages if validation fails.
     *   - `'user_exists'` if a user with the same email already exists.
     */
    public async createUser(
        email: string,
        password: string,
        type: Roles,
        active: number
    ): Promise<boolean | string[] | 'user_exists'> {
        const userExists: User | null = await this.getUserByMail(email);

        if (userExists !== null) {
            return 'user_exists';
        }
        const user = User.createUser(email, password, type, active);
        const userValidation: string[] | null = user.validateUser();
        const hashedPassword = await this.hashPassword(password);

        if (userValidation === null) {
            const userCreated = await this._database.register.createUser(
                email,
                hashedPassword,
                type,
                active
            );
            return userCreated;
        } else {
            return userValidation;
        }
    }

    /**
     * @author Youri Janssen
     * Retrieves a user by their email address from the database.
     * @param {string} email - The email address of the user to retrieve.
     * @returns {Promise<User | null>} A Promise that resolves with the user if found, or `null` if not found or an error occurs.
     */
    public getUserByMail(email: string): Promise<User | null> {
        return this._database.register.getUserByMail(email);
    }
}
