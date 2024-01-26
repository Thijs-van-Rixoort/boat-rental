import { BoatDatabaseInterface } from './boat';
import { RegisterDatabaseInterface } from './register';
import { SessionDatabaseInterface } from './session';
import { UserDatabaseInterface } from './user';

export interface DatabaseInterface {
    boat: BoatDatabaseInterface;
    register: RegisterDatabaseInterface;
    session: SessionDatabaseInterface;
    user: UserDatabaseInterface;
}
