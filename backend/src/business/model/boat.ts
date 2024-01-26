/**
 * Represents a deserialized user object.
 * @author Thijs van Rixoort
 */
export type DeserializedBoat = {
    id?: number;
    name: string;
    price_per_day_in_cents: number;
    capacity: number;
    license_required: boolean;
    skipper_required: boolean;
    facilities?: string[];
    images?: string[];
    fabrication_year?: number;
    length_in_meters?: number;
    active?: number;
};

/**
 * Represents a boat business object.
 * @author Youri Janssen & Thijs van Rixoort
 */
export class Boat {
    private _id?: number | undefined;
    public get id(): number | undefined {
        return this._id;
    }
    private name: string;
    get testName(): string {
        return this.name;
    }
    private price_per_day_in_cents: number;
    private capacity: number;
    private license_required: boolean;
    private skipper_required: boolean;
    private facilities?: string[];
    private _images?: string[];
    private fabrication_year?: number;
    private length_in_meters?: number;
    private active?: number;

    /**
     * @author Youri Janssen
     * Private constructor for Boat.
     * @param {string} name - The name of the boat.
     * @param {number} price_per_day_in_cents - The price per day in cents.
     * @param {number} capacity - The capacity of the boat.
     * @param {boolean} license_required - Flag indicating whether a license is required.
     * @param {boolean} skipper_required - Flag indicating whether a skipper is required.
     * @param {string} facilities - The facilities of the boat.
     */
    private constructor(
        name: string,
        price_per_day_in_cents: number,
        capacity: number,
        license_required: boolean,
        skipper_required: boolean,
        facilities?: string[],
        id?: number,
        images?: string[],
        fabrication_year?: number,
        length_in_meters?: number,
        active?: number
    ) {
        this.name = name;
        this.price_per_day_in_cents = price_per_day_in_cents;
        this.capacity = capacity;
        this.license_required = license_required;
        this.skipper_required = skipper_required;
        if (facilities) this.facilities = facilities;
        if (id !== undefined) {
            this._id = id;
        }
        if (fabrication_year) this.fabrication_year = fabrication_year;
        if (length_in_meters) this.length_in_meters = length_in_meters;
        if (active) this.active = active;
        if (images !== undefined) {
            this._images = images;
        }
    }

    /**
     * @author Youri Janssen
     * Creates a new Boat instance.
     * @param {string} name - The name of the boat.
     * @param {number} price_per_day_in_cents - The price per day in cents.
     * @param {number} capacity - The capacity of the boat.
     * @param {boolean} license_required - Flag indicating whether a license is required.
     * @param {boolean} skipper_required - Flag indicating whether a skipper is required.
     * @returns {Boat} The created Boat object.
     * @designpattern Factory Method - This method encapsulates the object creation logic. This allows for flexibility and the potential to switch to different Boat types without modifying the core function.
     */
    public static createBoat(
        name: string,
        price_per_day_in_cents: number,
        capacity: number,
        license_required: boolean,
        skipper_required: boolean,
        facilities: string[]
    ): Boat {
        return new Boat(
            name,
            price_per_day_in_cents,
            capacity,
            license_required,
            skipper_required,
            facilities
        );
    }

    /**
     * Creates a new Boat instance.
     * @param id The id of the boat.
     * @param name The name of the boat.
     * @param pricePerDayInCents The price per day in cents.
     * @param capacity The capacity of the boat.
     * @param licenseRequired Flag indicating whether a license is required.
     * @param skipperRequired Flag indicating whether a skipper is required.
     * @param images An array of image URLs/paths.
     * @returns the created Boat object.
     * @author Thijs van Rixoort
     */
    public static createBoatWithId(
        id: number,
        name: string,
        pricePerDayInCents: number,
        capacity: number,
        licenseRequired: boolean,
        skipperRequired: boolean,
        facilities: string[],
        images: string[]
    ): Boat {
        return new Boat(
            name,
            pricePerDayInCents,
            capacity,
            licenseRequired,
            skipperRequired,
            facilities,
            id,
            images
        );
    }

    /**
     * Converts the object to a deserialized JSON format.
     * @returns this object as a normal JSON object, where all properties are public.
     * @author Thijs van Rixoort
     */
    public toJSON(): DeserializedBoat {
        return {
            id: this._id,
            name: this.name,
            price_per_day_in_cents: this.price_per_day_in_cents,
            capacity: this.capacity,
            license_required: this.license_required,
            skipper_required: this.skipper_required,
            facilities: this.facilities,
            images: this._images,
            fabrication_year: this.fabrication_year,
            length_in_meters: this.length_in_meters,
            active: this.active
        };
    }
}
