import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    BelongsToMany,
    Unique,
    Default,
    ForeignKey,
    BelongsTo,
    HasMany
} from 'sequelize-typescript';
import { FacilityModel } from './facility';
import { BoatFacilityModel } from './boatfacility';
import BoatTypeModel from './boatmodel';
import { BelongsToManyAddAssociationsMixin } from 'sequelize';
import BoatImageModel from './boatimage';

/**
 * @author Youri Janssen
 * Represents the User model in the database.
 *
 * + Additional changes made by @author Marcus K.
 *   - Set Default values
 *   - Made values unique
 *   - Declared the properties
 */
@Table({
    tableName: 'Boat', // Specify the table name
    timestamps: false // Enable timestamps (createdAt and updatedAt)
})
export class BoatModel extends Model {
    @PrimaryKey
    @Unique
    @AutoIncrement
    @Column({ type: DataType.INTEGER().UNSIGNED, allowNull: false })
    public declare id: number;

    @Column({ type: DataType.STRING(), allowNull: false })
    public declare name: string;

    @Column({ type: DataType.MEDIUMINT().UNSIGNED, allowNull: false })
    public declare price_per_day_in_cents: number;

    @Column({ type: DataType.TINYINT().UNSIGNED, allowNull: false })
    public declare capacity: number;

    @Column({ type: DataType.TINYINT(), allowNull: false })
    public declare license_required: boolean;

    @Column({ type: DataType.TINYINT(), allowNull: false })
    public declare skipper_required: boolean;

    @ForeignKey(() => BoatTypeModel)
    @Column(DataType.INTEGER().UNSIGNED)
    public declare model_id: number;

    @Column(DataType.INTEGER().UNSIGNED)
    public declare fabrication_year: number;

    @Column(DataType.TINYINT().UNSIGNED)
    public declare length_in_meters: number;

    @Default('Deze boot heeft nog geen beschrijving!')
    @Column(DataType.TEXT)
    public declare description: string;

    @Default(1)
    @Column(DataType.TINYINT())
    public declare active: boolean;

    @BelongsToMany(() => FacilityModel, () => BoatFacilityModel)
    public declare facilities: FacilityModel[];

    @BelongsTo(() => BoatTypeModel)
    public declare boat_type_model: BoatTypeModel;

    @HasMany(() => BoatImageModel, 'boat_id')
    public declare images: BoatImageModel[];

    declare addFacilities: BelongsToManyAddAssociationsMixin<
        FacilityModel,
        FacilityModel['id']
    >;
}
