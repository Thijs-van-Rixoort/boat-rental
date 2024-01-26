import { Session as BusinessSession } from '../../business/model/session';

/**
 * An interface for the session table data access objects. Having this interface enables us to use dependency injection in our services.
 * @author Thijs van Rixoort
 */
export interface SessionDatabaseInterface {
    createSession(userId: number): Promise<BusinessSession>;
    deleteExpiredSessionsByUserId(userId: number): Promise<void>;
    deleteSessionById(sessionId: string): Promise<void>;
}
