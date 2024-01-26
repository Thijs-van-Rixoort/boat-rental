/**
 * @interface Boat - Represents a Boat object with its properties.
 * @author Youri Janssen & Thijs van Rixoort
 */
export interface Boat {
    id: number
    name: string;
    price_per_day_in_cents: number;
    capacity: number;
    license_required: boolean;
    skipper_required: boolean;
    facilities: string[];
    images: string[];
    fabrication_year?: number,
    length_in_meters?: number,
}
