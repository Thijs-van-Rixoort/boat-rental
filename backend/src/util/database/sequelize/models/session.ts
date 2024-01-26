import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    Unique
} from 'sequelize-typescript';
import { UserModel } from './user';

/**
 * A Sequelize Model that represents the session table in the database.
 * @author Thijs van Rixoort
 */
@Table({
    tableName: 'Session',
    timestamps: false
})
export class Session extends Model {
    @PrimaryKey
    @Unique
    @AllowNull(false)
    @AutoIncrement
    @Column(DataType.STRING)
    public id!: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    public expiration_date!: Date;

    @AllowNull(false)
    @ForeignKey(() => UserModel)
    @Column(DataType.INTEGER.UNSIGNED)
    public user_id!: number;

    @BelongsTo(() => UserModel)
    public user!: UserModel;
}
