import {
    AllowNull,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from 'sequelize-typescript';
import { BoatModel } from './boat';
import { FacilityModel } from './facility';

/**
 * @author Youri Janssen
 * Represents the Boatfacility model in the database.
 *
 * + Additional changes made by @author Marcus K.
 *   - Disallowed null & made it an unsigned interger
 *   - Declared the properties
 */
@Table({
    tableName: 'Boatfacility', // Specify the table name
    timestamps: false // Enable timestamps (createdAt and updatedAt)
})
export class BoatFacilityModel extends Model {
    @ForeignKey(() => BoatModel)
    @AllowNull(false)
    @Column(DataType.INTEGER().UNSIGNED)
    public declare boat_id: number;

    @ForeignKey(() => FacilityModel)
    @AllowNull(false)
    @Column(DataType.INTEGER().UNSIGNED)
    public declare facility_id: number;
}
