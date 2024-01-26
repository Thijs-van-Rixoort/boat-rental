import { RowDataPacket } from 'mysql2';
import { URL } from 'url';

export class DetailedBoat {
    public id: number;
    public name: string;
    public description: string;
    public price: number;
    public capacity: number;
    public licenseRequired: boolean;
    public skipperRequired: boolean;
    public modelId: number;
    public fabricationYear: number;
    public length: number;
    public active: boolean;
    public model: string;
    public brandName: string;

    public facilityArray: string[];
    public imageArray: string[];

    /**
     * Based entirely on Youri's instancing method, to keep things consistent.
     * @author Marcus K.
     */
    public constructor(
        id: number,
        name: string,
        description: string,
        price_per_day_in_cents: number,
        capacity: number,
        license_required: boolean,
        skipper_required: boolean,
        model_id: number,
        fabrication_year: number,
        length_in_meters: number,
        active: boolean,
        model: string,
        brandname: string,

        facility_array?: Array<object | RowDataPacket>,
        image_array?: Array<object | RowDataPacket>
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price_per_day_in_cents;
        this.capacity = capacity;
        this.licenseRequired = Boolean(license_required);
        this.skipperRequired = Boolean(skipper_required);
        this.modelId = model_id;
        this.fabricationYear = fabrication_year;
        this.length = length_in_meters;
        this.active = Boolean(active);
        this.model = model;
        this.brandName = brandname;

        this.facilityArray = this.flattenObjectArray(facility_array);
        this.imageArray = this.flattenObjectArray(image_array);
    }

    /**
     * A function dedicated to remove keys from an object array and just leaves strings behind, which cleans the outgoing data somewhat.
     * @param array contains an array of objects, of which the keys get removed.
     * @returns a flattened and cleaned up array like mentioned.
     * @author Marcus K.
     */
    private flattenObjectArray(
        array: Array<object | RowDataPacket> | undefined
    ): string[] {
        const newArray: string[] = [];

        if (array) {
            array.forEach((element: object | RowDataPacket) => {
                newArray.push(Object.values(element) as unknown as string); //agree that this is type assertion is bad, not done properly.
            });
        }

        return newArray.flat();
    }
}

/**
 * A class dedicated to surface-level filter out bad data out of incoming data for creating a new boat.
 * Does not necessary account for special symbols that break systems, but it should still do a lot of the heavy lifting.
 */
export class IncomingDetailedBoat {
    private _name?: string;
    public get name(): string {
        return this._name!;
    }
    private set name(value: string) {
        if (
            value.length <= 100 &&
            value.length >= 1 &&
            typeof value === 'string'
        ) {
            this._name = value;
        } else {
            throw new Error(
                'De naam moet tussen de 1 tot 100 letters lang zijn'
            );
        }
    }

    private _price?: number;
    public get price(): number {
        return this._price!;
    }
    private set price(value: number) {
        if (value >= 0 && value <= 16777215 && typeof value === 'number') {
            this._price! = value;
        } else {
            throw new Error(
                'De prijs moet een waarde zijn tussen 0 en 16777215'
            );
        }
    }

    private _capacity?: number;
    public get capacity(): number {
        return this._capacity!;
    }
    private set capacity(value: number) {
        if (value >= 0 && value <= 255 && typeof value === 'number') {
            this._capacity! = value;
        } else {
            throw new Error(
                'De capaciteit moet een waarde zijn tussen 0 and 255'
            );
        }
    }

    private _licenseRequired?: boolean;
    public get licenseRequired(): boolean {
        return this._licenseRequired!;
    }

    private set licenseRequired(value: boolean) {
        if (typeof value === 'boolean') {
            this._licenseRequired! = value;
        } else {
            throw new Error('Vaarbewijs moet wel of niet verplicht zijn');
        }
    }

    private _skipperRequired?: boolean;
    public get skipperRequired(): boolean {
        return this._skipperRequired!;
    }
    private set skipperRequired(value: boolean) {
        if (typeof value === 'boolean') {
            this._skipperRequired! = value;
        } else {
            throw new Error('Skipper moet wel of niet verplicht zijn');
        }
    }

    public id?: number | undefined;

    public description?: string | undefined;

    public modelId?: number | undefined;

    public fabricationYear?: number | undefined;

    public length?: number | undefined;

    public active?: boolean | undefined;

    public model?: string | undefined;

    public brandName?: string | undefined;

    public facilityArray?: string[] | undefined;

    public imageArray?: string[] | undefined;

    /**
     * Based on a modified version of Youri's instancing method, to keep things consistent.
     * @author Marcus K.
     */
    public constructor(
        name: string,
        price: number,
        capacity: number,
        licenseRequired: boolean,
        skipperRequired: boolean,

        id?: number,
        description?: string,
        fabricationYear?: number,
        length?: number,
        active?: boolean,
        model?: string,
        brandName?: string,

        modelId?: number,
        facilityArray?: Array<string>,
        imageArray?: Array<string>
    ) {
        Object.defineProperty(this, 'id', {
            get() {
                return id;
            },
            set(value: number | undefined) {
                if (
                    (value &&
                        value >= 1 &&
                        value <= 4294967295 &&
                        typeof value === 'number') ||
                    value === undefined
                ) {
                    id = value;
                } else {
                    throw new Error(
                        'Id moet een waarde zijn tussen 1 en 4294967295'
                    );
                }
            }
        });
        this.id = id;

        this.name = name;

        Object.defineProperty(this, 'description', {
            get() {
                return description;
            },
            set(value: string | undefined) {
                if (
                    (value !== undefined &&
                        value.length <= 255 &&
                        value.length >= 0 &&
                        typeof value === 'string') ||
                    value === undefined
                ) {
                    description = value;
                } else {
                    throw new Error(
                        'Descriptie moet tussen de 0 tot 255 letters lang zijn'
                    );
                }
            }
        });
        this.description = description;

        this.price = price;

        this.capacity = capacity;

        this.licenseRequired = licenseRequired;

        this.skipperRequired = skipperRequired;

        Object.defineProperty(this, 'modelId', {
            get() {
                return modelId;
            },
            set(value: number | undefined) {
                if (
                    (value !== undefined &&
                        value >= 1 &&
                        value <= 4294967295 &&
                        typeof value === 'number') ||
                    value === undefined
                ) {
                    modelId = value;
                } else {
                    throw new Error(
                        'ModelId moet een waarde zijn tussen 1 en 4294967295'
                    );
                }
            }
        });
        this.modelId = modelId;

        Object.defineProperty(this, 'fabricationYear', {
            get() {
                return fabricationYear;
            },
            set(value: number | undefined) {
                if (
                    (value !== undefined &&
                        value >= 0 &&
                        value <= 4294967295 &&
                        typeof value === 'number') ||
                    value === undefined
                ) {
                    fabricationYear = value;
                } else {
                    throw new Error(
                        'Het bouwjaar moet een waarde zijn tussen 0 en 4294967295'
                    );
                }
            }
        });
        this.fabricationYear = fabricationYear;

        Object.defineProperty(this, 'length', {
            get() {
                return length;
            },
            set(value: number | undefined) {
                if (
                    (value !== undefined &&
                        value >= 0 &&
                        value <= 255 &&
                        typeof value === 'number') ||
                    value === undefined
                ) {
                    length = value;
                } else {
                    throw new Error(
                        'De lengte moet een waarde zijn tussen 0 en 255'
                    );
                }
            }
        });
        this.length = length;

        Object.defineProperty(this, 'active', {
            get() {
                return active;
            },
            set(value: boolean | undefined) {
                if (typeof value === 'boolean') {
                    active = value;
                } else {
                    throw new Error('De boot moet actief of inactief zijn');
                }
            }
        });
        this.active = active;

        Object.defineProperty(this, 'model', {
            get() {
                return model;
            },
            set(value: string | undefined) {
                if (
                    (value !== undefined &&
                        value.length <= 100 &&
                        value.length >= 1 &&
                        typeof value === 'string') ||
                    value === undefined
                ) {
                    model = value;
                } else {
                    throw new Error(
                        'De modelnaam moet tussen de 1 tot 100 leeters lang zijn'
                    );
                }
            }
        });
        this.model = model;

        Object.defineProperty(this, 'brandName', {
            get() {
                return brandName;
            },
            set(value: string | undefined) {
                if (
                    (value !== undefined &&
                        value.length <= 100 &&
                        value.length >= 1 &&
                        typeof value === 'string') ||
                    value === undefined
                ) {
                    brandName = value;
                } else {
                    throw new Error(
                        'De merknaam moet tussen de 1 tot 100 letters lang zijn'
                    );
                }
            }
        });
        this.brandName = brandName;

        Object.defineProperty(this, 'facilityArray', {
            get() {
                return facilityArray;
            },
            set(value: string[] | undefined) {
                if (Array.isArray(value)) {
                    facilityArray = value.map(facility => {
                        if (
                            facility.length <= 100 &&
                            facility.length >= 1 &&
                            typeof facility === 'string'
                        ) {
                            return facility;
                        } else {
                            throw new Error(
                                'Een faciliteit moet tussen de 1 tot 100 letters lang zijn'
                            );
                        }
                    });
                } else if (value === undefined) {
                    facilityArray = value;
                } else {
                    throw new Error(
                        'Een faciliteit moet tussen de 1 tot 100 letters lang zijn'
                    );
                }
            }
        });
        this.facilityArray = facilityArray;

        Object.defineProperty(this, 'imageArray', {
            get() {
                return imageArray;
            },
            set(value: string[] | undefined) {
                if (value && Array.isArray(value)) {
                    imageArray = value.map((image: string) => {
                        if (
                            image.length <= 255 &&
                            image.length >= 1 &&
                            typeof image === 'string'
                        ) {
                            return image;
                        } else {
                            throw new Error(
                                'Een URL moet tussen de 1 tot 255 letters lang zijn. Huidige lengte: (' +
                                    image.length +
                                    ')'
                            );
                        }
                    });
                } else if (value === undefined) {
                    imageArray = value;
                } else {
                    throw new Error(
                        'Een URL moet tussen de 1 tot 255 letters lang zijn.'
                    );
                }
            }
        });
        this.imageArray = imageArray;
    }

    public static createIncomingBoat(
        name: string,
        price: number,
        capacity: number,
        licenseRequired: boolean,
        skipperRequired: boolean,

        id?: number,
        description?: string,
        fabricationYear?: number,
        length?: number,
        active?: boolean,
        model?: string,
        brandName?: string,

        modelId?: number,
        facilityArray?: Array<string>,
        imageArray?: Array<string>
    ): IncomingDetailedBoat {
        return new IncomingDetailedBoat(
            name,
            price,
            capacity,
            licenseRequired,
            skipperRequired,

            id,
            description,
            fabricationYear,
            length,
            active,
            model,
            brandName,

            modelId,
            facilityArray,
            imageArray
        );
    }

    public static validateUrl(url: string): string {
        try {
            /* Internal note, URL is actually pretty cool and can do so much more. Look deeper into it sometime! 
            That said, it does convert Unicode characters to ASCII, which does increase url length!*/
            url = new URL(url).href;

            /* This regex is a modified version of UI Bakery's URL regex.
            It checks if it optionally starts with https and allows simple letters, numbers and a few special characters before-and-as the top-level domain, as well as in the subdirectory
            I could limit the length here as well, as 256 as domain would way surpass our limits, but it's already checked elsewhere */
            const urlRegex: RegExp = new RegExp(
                /^(?:https?:\/\/)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/
            );
            if (!urlRegex.test(url)) {
                throw new Error();
            }

            return url;
        } catch (error) {
            throw new Error('URL(s) moeten de WHATWG URL Standaard aanhouden');
        }
    }
}
