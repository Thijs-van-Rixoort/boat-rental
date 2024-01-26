import { Op } from 'sequelize';
import { Session as BusinessSession } from '../../business/model/session';
import { Session as SequelizeSession } from '../../util/database/sequelize/models/session';
import { SessionDatabaseInterface } from '../interfaces/session';
import { Sequelize } from 'sequelize-typescript';

/**
 * A data access object for the session table in our database.
 * @author Thijs van Rixoort
 */
export class SessionSequelizeDatabase implements SessionDatabaseInterface {
    /**
     * Creates a session and stores it in the database.
     * @param userId The user id that is bound to the session.
     * @returns the created session.
     * @author Thijs van Rixoort
     */
    public async createSession(userId: number): Promise<BusinessSession> {
        const session: BusinessSession = new BusinessSession(userId);

        const sessionData: SequelizeSession = await SequelizeSession.create({
            id: session.id,
            expiration_date: session.expirationDate,
            user_id: session.userId
        });

        if (sessionData === undefined) {
            throw new Error(
                'U kon helaas niet worden ingelogd, probeer het later opnieuw.'
            );
        }

        return this.convertSequelizeSessionToBusinessSession(sessionData);
    }

    /**
     * Delete all expired session based that have the provided user id.
     * @param userId The id of the user whose expired sessions are about to be deleted.
     * @author Thijs van Rixoort
     */
    public async deleteExpiredSessionsByUserId(userId: number): Promise<void> {
        await SequelizeSession.destroy({
            where: {
                user_id: userId,
                expiration_date: { [Op.lt]: Sequelize.literal('NOW()') }
            }
        });
    }

    /**
     * Deletes a session from the database.
     * @param sessionId The id of the session that you want to remove.
     * @author Thijs van Rixoort
     */
    public async deleteSessionById(sessionId: string): Promise<void> {
        const deletedRows: number = await SequelizeSession.destroy({
            where: {
                id: sessionId
            }
        });

        if (deletedRows === 0) {
            throw new Error("Session couldn't be deleted from the database.");
        }
    }

    /**
     * Converts session data from queries to an object of the Session business model.
     * @param sessionData A SequelizeSession object containing data from a query.
     * @returns the created session object.
     * @author Thijs van Rixoort
     */
    private convertSequelizeSessionToBusinessSession(
        sessionData: SequelizeSession
    ): BusinessSession {
        return new BusinessSession(
            sessionData.user_id,
            sessionData.id,
            sessionData.expiration_date
        );
    }
}
