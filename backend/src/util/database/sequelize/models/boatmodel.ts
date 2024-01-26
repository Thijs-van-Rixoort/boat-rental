import {
    AllowNull,
    AutoIncrement,
    Column,
    DataType,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    Unique
} from 'sequelize-typescript';
import { BoatModel } from './boat';
import { NonAttribute } from 'sequelize';

@Table({
    tableName: 'Boatmodel',
    timestamps: false
})

/**
 * A simple Sequelize model for the BoatTypeModel. Which, besides the akward name, contains the type and brand of a given boat.
 * @author Marcus K.
 */
export default class BoatTypeModel extends Model {
    @PrimaryKey
    @AllowNull(false)
    @Unique
    @AutoIncrement
    @Column(DataType.INTEGER().UNSIGNED)
    public declare id: number;

    @AllowNull(false)
    @Column(DataType.CHAR(100))
    public declare model: string;

    @AllowNull(false)
    @Column(DataType.CHAR(100))
    public declare brandname: string;

    @HasMany(() => BoatModel, { foreignKey: 'model_id' })
    public declare model_id: NonAttribute<BoatModel[]>;
}
