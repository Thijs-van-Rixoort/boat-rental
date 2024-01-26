import { DatabaseInterface } from '../interfaces/database';
import { BoatSequelizeDatabase } from './boat';
import { RegisterSequelizeDatabase } from './register';
import { SessionSequelizeDatabase } from './session';
import { UserSequelizeDatabase } from './user';

export class SequelizeDatabase implements DatabaseInterface {
    public boat: BoatSequelizeDatabase = new BoatSequelizeDatabase();
    public register: RegisterSequelizeDatabase =
        new RegisterSequelizeDatabase();
    public session: SessionSequelizeDatabase = new SessionSequelizeDatabase();
    public user: UserSequelizeDatabase = new UserSequelizeDatabase();
}
