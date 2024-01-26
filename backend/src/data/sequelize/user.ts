import { UserDatabaseInterface } from '../interfaces/user';
import { User as BusinessUser } from '../../business/model/user';
import { UserModel } from '../../util/database/sequelize/models/user';
import { Session as SequelizeSession } from '../../util/database/sequelize/models/session';

/**
 * A data access object for the user table in our database.
 * @author Thijs van Rixoort
 */
export class UserSequelizeDatabase implements UserDatabaseInterface {
    /**
     * Gets a user from the database by using their email address.
     * @param email The email address of the user you want to retrieve.
     * @returns the user if the email is found in the user table, else null.
     * @author Thijs van Rixoort
     */
    public async getUserByEmail(email: string): Promise<BusinessUser> {
        const userData: UserModel | null = await UserModel.findOne({
            where: { email: email }
        });

        if (userData !== null) {
            return this.convertSequelizeUserToBusinessUser(userData);
        } else {
            throw new Error('Het e-mailadres of wachtwoord klopt niet.');
        }
    }

    /**
     * Updates an existing user in the database.
     * @param user the User object that you want to update in the database.
     * @author Thijs van Rixoort
     */
    public async updateUserById(user: BusinessUser): Promise<BusinessUser> {
        const affectedRows: [AffectedCount: number] = await UserModel.update(
            {
                active: user.active,
                firstName: user.firstName,
                preposition: user.preposition,
                lastName: user.lastName,
                mobileNumber: user.mobileNumber,
                city: user.city,
                street: user.street,
                houseNumber: user.houseNumber,
                zipCode: user.zipCode
            },
            { where: { id: user.id } }
        );

        if (affectedRows[0] === 0) {
            throw new Error('De gebruiker kon niet worden aagepast.');
        }

        return user;
    }

    /**
     * Gets a user fro the database by using their login session id.
     * @param sessionId The session id.
     * @returns the user when it is found in the database.
     * @author Thijs van Rixoort
     */
    public async getUserBySessionId(sessionId: string): Promise<BusinessUser> {
        const session: SequelizeSession | null = await SequelizeSession.findOne(
            {
                include: [UserModel],
                where: { id: sessionId }
            }
        );

        if (session === null) {
            throw new Error('Deze gebruiker is niet ingelogd.');
        }

        return this.convertSequelizeUserToBusinessUser(session.user);
    }

    /**
     * Converts a Sequelize UserModel to a business model of a user.
     * @param sequelizeUser The user data in a UserModel object.
     * @returns the BusinessUser object containing the data of the Sequelize UserModel object.
     * @author Thijs van Rixoort
     */
    private convertSequelizeUserToBusinessUser(
        sequelizeUser: UserModel
    ): BusinessUser {
        return BusinessUser.createCompleteUser(
            sequelizeUser.email,
            sequelizeUser.password,
            sequelizeUser.active,
            sequelizeUser.id,
            sequelizeUser.firstName,
            sequelizeUser.preposition,
            sequelizeUser.lastName,
            sequelizeUser.mobileNumber,
            sequelizeUser.city,
            sequelizeUser.street,
            sequelizeUser.houseNumber,
            sequelizeUser.zipCode,
            sequelizeUser.type
        );
    }

    /**
     * @method getUserTypeSequelize is simply the queries to find the type of user within the database.
     * @param sessionToken is the user session token given with the cookie itself
     * @returns either a string with the type, or nothing at all
     * @author Marcus K.
     */
    public async getUserType(sessionToken: string): Promise<string | null> {
        const userId: SequelizeSession | null = await SequelizeSession.findOne({
            attributes: ['user_id'],
            where: { id: sessionToken }
        });

        const userType: UserModel | null =
            userId && userId.user_id
                ? await UserModel.findOne({
                      attributes: ['type'],
                      where: { id: userId.user_id }
                  })
                : null;

        return userType ? userType.type : null;
    }
}
