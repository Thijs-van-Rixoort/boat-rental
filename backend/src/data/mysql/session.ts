import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { MysqlDatabaseConfig } from '../../util/database/mysql/mysql';

import { Session as BusinessSession } from '../../business/model/session';
import { SessionDatabaseInterface } from '../interfaces/session';

/**
 * A data access object for the session table in our database.
 * @author Thijs van Rixoort
 */
export class SessionMysqlDatabase implements SessionDatabaseInterface {
    /**
     * Creates a session and stores it in the database.
     * @param userId The user id that is bound to the session.
     * @returns the created session.
     * @author Thijs van Rixoort
     */
    public async createSession(userId: number): Promise<BusinessSession> {
        let returnValue: BusinessSession;
        const session: BusinessSession = new BusinessSession(userId);

        const results: ResultSetHeader = (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<ResultSetHeader>(
                    'INSERT INTO `session`(id, expiration_date, user_id) VALUES(?, ?, ?);',
                    [session.id, session.expirationDate, session.userId]
                )
        )[0];

        if (results.affectedRows !== 0 || results.affectedRows !== undefined) {
            returnValue = session;
        } else {
            throw new Error(
                'U kon helaas niet worden ingelogd, probeer het later opnieuw.'
            );
        }

        return returnValue;
    }

    /**
     * Delete all expired session based that have the provided user id.
     * @param userId The id of the user whose expired sessions are about to be deleted.
     * @author Thijs van Rixoort
     */
    public async deleteExpiredSessionsByUserId(userId: number): Promise<void> {
        await MysqlDatabaseConfig.pool
            .promise()
            .execute(
                'DELETE FROM `session` WHERE `user_id` = ? AND `expiration_date` < NOW();',
                [userId]
            );
    }

    /**
     * Deletes a session from the database.
     * @param sessionId The id of the session that you want to remove.
     * @author Thijs van Rixoort
     */
    public async deleteSessionById(sessionId: string): Promise<void> {
        const result: ResultSetHeader = (
            await MysqlDatabaseConfig.pool
                .promise()
                .execute<ResultSetHeader>(
                    'DELETE FROM `session` WHERE `id` = ?;',
                    [sessionId]
                )
        )[0];

        if (result.affectedRows === 0) {
            throw new Error("Session couldn't be deleted from the database.");
        }
    }

    /**
     * Converts session data from queries to an object of the Session business model.
     * @param sessionData The data gathered from queries.
     * @returns the created session object.
     * @author Thijs van Rixoort
     */
    private convertRowDataPacketToBusinessSession(
        sessionData: RowDataPacket
    ): BusinessSession {
        return new BusinessSession(
            sessionData.user_id,
            sessionData.id,
            sessionData.expiration_date
        );
    }
}
