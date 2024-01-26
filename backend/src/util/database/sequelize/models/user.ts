import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    HasMany
} from 'sequelize-typescript';
import { Session } from './session';
import { Roles } from '../../../../business/model/user';

/**
 * @author Youri Janssen & Thijs van Rixoort
 * Represents the User model in the database.
 */
@Table({
    underscored: true,
    tableName: 'User', // Specify the table name
    timestamps: false // Enable timestamps (createdAt and updatedAt)
})
export class UserModel extends Model<UserModel> {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    public declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    public declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    public declare password: string;

    @Column({ type: DataType.ENUM('user', 'admin'), allowNull: false })
    declare type: Roles;

    @Column({ type: DataType.TINYINT, allowNull: false })
    public active?: number;

    @Column({ type: DataType.STRING, allowNull: true })
    public firstName?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    public preposition?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    public lastName?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    public mobileNumber?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    public city?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    public street?: string;

    @Column({ type: DataType.SMALLINT.UNSIGNED, allowNull: true })
    public houseNumber?: number;

    @Column({ type: DataType.STRING, allowNull: true })
    public zipCode?: string;

    @HasMany(() => Session, 'user_id')
    public declare session?: Session[];
}
