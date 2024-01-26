import { DatabaseInterface } from '../../data/interfaces/database';
import { Session } from '../model/session';
import { User } from '../model/user';

/**
 * A class that handles the business logic for sessions.
 * @author Thijs van Rixoort
 */
export class SessionService {
    public constructor(private _database: DatabaseInterface) {}

    /**
     * Handles the login functionality.
     * @param email The email from the user that wants to log in.
     * @param password The password from the user that wants to log in.
     * @returns a session if everything is correct, else null.
     * @author Thijs van Rixoort
     */
    public async login(email: string, password: string): Promise<Session> {
        const user: User = await this._database.user.getUserByEmail(email);

        if (user.id !== undefined && (await user.validatePassword(password))) {
            await this._database.session.deleteExpiredSessionsByUserId(user.id);
            return this._database.session.createSession(user.id);
        }

        throw new Error('Het e-mailadres of wachtwoord klopt niet.');
    }

    /**
     * Log out a user by removing their session from the database.
     * @param sessionId The id of the session that you want to remove.
     * @author Thijs van Rixoort
     */
    public async logout(sessionId: string): Promise<void> {
        await this._database.session.deleteSessionById(sessionId);
    }

    /**
     * @method getUserType uses either MySQL or Sequelize to find out which way to query the user's type.
     * @param cookie is the cookie bundled with the incoming request.
     * @returns either a string with the user type, or nothing at all.
     * @author Marcus K.
     */
    public async getUserType(cookie: string): Promise<string | null> {
        return await this._database.user.getUserType(cookie);
    }
}
