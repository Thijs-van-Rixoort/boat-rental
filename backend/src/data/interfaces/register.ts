import { Roles, User } from '../../business/model/user';

/**
 * An interface for managing registration-related database operations.
 * @author Youri Janssen
 */
export interface RegisterDatabaseInterface {
    createUser(
        email: string,
        password: string,
        type: Roles,
        active: number
    ): Promise<boolean>;
    getUserByMail(email: string): Promise<User | null>;
}
