import {
    AllowNull,
    AutoIncrement,
    BelongsToMany,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table,
    Unique
} from 'sequelize-typescript';
import { BoatModel } from './boat';
import { BoatFacilityModel } from './boatfacility';

/**
 * @author Youri Janssen
 * Represents the Facility model in the database.
 *
 * + Additional changes made by @author Marcus K.
 *   - Disallowed nulls & made it an unsigned interger
 *   - Made values unique
 *   - Declared the properties
 */
@Table({
    tableName: 'Facility', // Specify the table name
    timestamps: false // Enable timestamps (createdAt and updatedAt)
})
export class FacilityModel extends Model {
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Unique
    @Column(DataType.INTEGER().UNSIGNED)
    public declare id: number;

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    public declare facility: string;

    @BelongsToMany(() => BoatModel, () => BoatFacilityModel)
    public declare boats: BoatModel[];
}
