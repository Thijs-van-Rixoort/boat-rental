import { DatabaseInterface } from '../interfaces/database';
import { BoatMysqlDatabase } from './boat';
import { RegisterMysqlDatabase } from './register';
import { SessionMysqlDatabase } from './session';
import { UserMysqlDatabase } from './user';

export class MySQLDatabase implements DatabaseInterface {
    public boat: BoatMysqlDatabase = new BoatMysqlDatabase();
    public register: RegisterMysqlDatabase = new RegisterMysqlDatabase();
    public session: SessionMysqlDatabase = new SessionMysqlDatabase();
    public user: UserMysqlDatabase = new UserMysqlDatabase();
}
