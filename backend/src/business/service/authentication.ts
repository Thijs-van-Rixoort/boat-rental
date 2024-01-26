import { UserDatabaseInterface } from '../../data/interfaces/user';
import { User } from '../model/user';

/**
 * A service that is used for authentication.
 * @author Thijs van Rixoort
 */
export class AuthenticationService {
    public constructor(private userDatabase: UserDatabaseInterface) {}

    /**
     * Gets a User from the database and returns it so a user can be authenticated.
     * @param sessionId The session id that is bound to a request in a cookie.
     * @returns the User that is bound to the session id.
     * @author Thijs van Rixoort
     */
    public authenticateUser(sessionId: string): Promise<User> {
        return this.userDatabase.getUserBySessionId(sessionId);
    }
}
