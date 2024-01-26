import * as argon2 from 'argon2';

/**
 * @author Youri Janssen
 * Represents the roles of a user.
 */
export enum Roles {
    USER = 'user',
    ADMIN = 'admin'
}

/**
 * A type that is used to display any user validation errors.
 * It contains a key for every property that needs validation on the user class.
 * @author Thijs van Rixoort
 */
export type UserValidationErrors = {
    firstName?: string;
    preposition?: string;
    lastName?: string;
    mobileNumber?: string;
    city?: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
    message?: string;
};

/**
 * Represents a deserialized user object.
 * @author Thijs van Rixoort
 */
export type DeserializedUser = {
    email?: string;
    password?: string;
    active?: number;
    type?: Roles;
    id?: number;
    firstName?: string;
    preposition?: string;
    lastName?: string;
    mobileNumber?: string;
    city?: string;
    street?: string;
    houseNumber?: number;
    zipCode?: string;
};

/**
 * @author Youri Janssen & Thijs van Rixoort
 * Represents a user business object.
 */
export class User {
    private _email: string | undefined;
    public get email(): string | undefined {
        return this._email;
    }
    private _password: string | undefined;
    public get password(): string | undefined {
        return this._password;
    }
    private _type?: Roles | undefined;
    public get type(): Roles | undefined {
        return this._type;
    }
    private _active: number | undefined;
    public get active(): number | undefined {
        return this._active;
    }
    private _id?: number | undefined;
    public get id(): number | undefined {
        return this._id;
    }
    public set id(value: number | undefined) {
        this._id = value;
    }
    private _firstName: string | undefined;
    public get firstName(): string | undefined {
        return this._firstName;
    }
    private _preposition: string | undefined;
    public get preposition(): string | undefined {
        return this._preposition;
    }
    private _lastName: string | undefined;
    public get lastName(): string | undefined {
        return this._lastName;
    }
    private _mobileNumber: string | undefined;
    public get mobileNumber(): string | undefined {
        return this._mobileNumber;
    }
    private _city: string | undefined;
    public get city(): string | undefined {
        return this._city;
    }
    private _street: string | undefined;
    public get street(): string | undefined {
        return this._street;
    }
    private _houseNumber: number | undefined;
    public get houseNumber(): number | undefined {
        return this._houseNumber;
    }
    private _zipCode: string | undefined;
    public get zipCode(): string | undefined {
        return this._zipCode;
    }

    private _validationErrors: UserValidationErrors = {};
    public get validationErrors(): UserValidationErrors {
        return this._validationErrors;
    }
    private set validationErrors(value: UserValidationErrors) {
        this._validationErrors = value;
    }

    /**
     * @author Youri Janssen & Thijs van Rixoort
     * Creates a new User instance.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @param id The user's database id.
     */
    private constructor(
        email: string | undefined,
        password: string | undefined,
        active: number | undefined,
        type: Roles | undefined,
        id: number | undefined = undefined,
        firstName: string | undefined = undefined,
        preposition: string | undefined = undefined,
        lastName: string | undefined = undefined,
        mobileNumber: string | undefined = undefined,
        city: string | undefined = undefined,
        street: string | undefined = undefined,
        houseNumber: number | undefined = undefined,
        zipCode: string | undefined = undefined
    ) {
        this._email = email;
        this._password = password;
        this._type = type;
        this._active = active;
        this._id = id;
        this._firstName = firstName;
        this._preposition = preposition;
        this._lastName = lastName;
        this._mobileNumber = mobileNumber;
        this._city = city;
        this._street = street;
        this._houseNumber = houseNumber;
        this._zipCode = zipCode;
        this.validateProperties();
    }

    /**
     * @author Youri Janssen
     * Method for creates a new User instance.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {User} The created User object.
     * @designpattern Factory Method - This method encapsulates the object creation logic. This allows for flexibility and the potential to switch to different User types without modifying the core function.
     */
    public static createUser(
        email: string,
        password: string,
        type: Roles,
        active: number | undefined
    ): User {
        return new User(email, password, active, type);
    }

    /**
     * Creates a User instance with an id.
     * @param id The user's id.
     * @param email The user's email.
     * @param password The user's password.
     * @param type The user type, which is 'admin' or 'user'.
     * @param active The active boolean. If the user is active it is true, else false.
     * @returns the created User instance.
     * @author Thijs van Rixoort
     */
    public static createUserWithId(
        id: number,
        email: string,
        password: string,
        type: Roles,
        active: number | undefined
    ): User {
        return new User(email, password, active, type, id);
    }

    /**
     * Creates a User instance with, optionally, every single property.
     * @param email The user's e-mail address.
     * @param password The user's password.
     * @param active A boolean to check if a user's account is still active.
     * @param id The user's id.
     * @param firstName The user's first name.
     * @param preposition The user's preposition.
     * @param lastName The user's last name.
     * @param mobileNumber The user's mobile phone number.
     * @param city The city the user lives in.
     * @param street The street the user lives in.
     * @param houseNumber The house number of the user.
     * @param zipCode The user's zip code.
     * @param type The user's type.
     * @returns an instance of User.
     * @author Thijs van Rixoort
     */
    public static createCompleteUser(
        email: string | undefined,
        password: string | undefined,
        active: number | undefined,
        id: number | undefined,
        firstName: string | undefined,
        preposition: string | undefined,
        lastName: string | undefined,
        mobileNumber: string | undefined,
        city: string | undefined,
        street: string | undefined,
        houseNumber: number | undefined,
        zipCode: string | undefined,
        type: Roles | undefined
    ): User {
        return new User(
            email,
            password,
            active,
            type,
            id,
            firstName,
            preposition,
            lastName,
            mobileNumber,
            city,
            street,
            houseNumber,
            zipCode
        );
    }

    /**
     * @author Youri Janssen
     * Validates the user's email and password.
     * @returns {null|string[]} An array of validation error messages, or null if valid.
     */
    public validateUser(): null | string[] {
        const passwordRegEx =
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/;

        const emailRegEx =
            /^(?=.{1,320}$)^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const error: string[] = [];
        if (this.password && passwordRegEx.test(this.password) === false) {
            error.push('Invalid password');
        }
        if (this.email && emailRegEx.test(this.email) === false) {
            error.push('Invalid email');
        }
        return error.length > 0 ? error : null;
    }

    /**
     * Checks whether the properties on this object are valid or not.
     * @returns true if the properties are all valid, else false.
     * @author Thijs van Rixoort
     */
    public isValid(): boolean {
        let returnValue: boolean = true;
        const errorList: string[] = Object.values(this.validationErrors);

        errorList.forEach((error: string) => {
            if (error) {
                returnValue = false;
            }
        });

        return returnValue;
    }

    /**
     * Validates all the properties on this instance.
     * @returns an object containing all the failed property validations.
     * @author Thijs van Rixoort
     */
    public validateProperties(): void {
        let errors: UserValidationErrors = {};

        errors = {
            ...this.validateFirstName(),
            ...this.validatePreposition(),
            ...this.validateLastName(),
            ...this.validateMobileNumber(),
            ...this.validateCity(),
            ...this.validateStreet(),
            ...this.validateHouseNumber(),
            ...this.validateZipCode()
        };

        this.validationErrors = errors;
    }

    /**
     * Checks whether a string value has no more than the maximum amount of characters that is allowed.
     * @param propertyValue The string value of a property from this instance.
     * @param maxLength The maximum amount of characters allowed in the propertyValue.
     * @param errorMessage The error message that is returned if the propertyValue is invalid.
     * @returns undefined when the propertyValue is valid, else the error message.
     * @author Thijs van Rixoort
     */
    private validateStringMaxLength(
        propertyValue: string | undefined,
        maxLength: number,
        errorMessage: string
    ): string | undefined {
        let returnValue: string | undefined;

        if (propertyValue && propertyValue.length > maxLength) {
            returnValue = errorMessage;
        }

        return returnValue;
    }

    /**
     * Validates the firstName property.
     * @returns an empty object when the property is valid,
     * an object containing an error when the property is invalid.
     * @author Thijs van Rixoort
     */
    private validateFirstName(): { firstName?: string } {
        const errors: { firstName?: string } = {};

        errors['firstName'] = this.validateStringMaxLength(
            this.firstName,
            45,
            'Je voornaam mag maximaal 45 karakters lang zijn'
        );

        return errors;
    }

    /**
     * Validates the preposition property.
     * @returns an empty object when the property is valid,
     * an object containing an error when the property is invalid.
     * @author Thijs van Rixoort
     */
    private validatePreposition(): { preposition?: string } {
        const errors: { preposition?: string } = {};

        errors['preposition'] = this.validateStringMaxLength(
            this.preposition,
            10,
            'Het tussenvoegsel mag maximaal 10 karakters lang zijn'
        );

        return errors;
    }

    /**
     * Validates the lastName property.
     * @returns an empty object when the property is valid,
     * an object containing an error when the property is invalid.
     * @author Thijs van Rixoort
     */
    private validateLastName(): { lastName?: string } {
        const errors: { lastName?: string } = {};

        errors['lastName'] = this.validateStringMaxLength(
            this.lastName,
            45,
            'Je achternaam mag maximaal 45 karakters lang zijn'
        );

        return errors;
    }

    /**
     * Validates the mobileNumber property.
     * @returns an empty object when the property is valid,
     * an object containing an error when the property is invalid.
     * @author Thijs van Rixoort
     */
    private validateMobileNumber(): { mobileNumber?: string } {
        const errors: { mobileNumber?: string } = {};

        errors['mobileNumber'] = this.validateStringMaxLength(
            this.mobileNumber,
            20,
            'Je mobiele nummer mag maximaal 20 karakters lang zijn'
        );

        return errors;
    }

    /**
     * Validates the city property.
     * @returns an empty object when the property is valid,
     * an object containing an error when the property is invalid.
     * @author Thijs van Rixoort
     */
    private validateCity(): { city?: string } {
        const errors: { city?: string } = {};

        errors['city'] = this.validateStringMaxLength(
            this.city,
            100,
            'De naam van de stad mag maximaal 100 karakters lang zijn'
        );

        return errors;
    }

    /**
     * Validates the street property.
     * @returns an empty object when the property is valid,
     * an object containing an error when the property is invalid.
     * @author Thijs van Rixoort
     */
    private validateStreet(): { street?: string } {
        const errors: { street?: string } = {};

        errors['street'] = this.validateStringMaxLength(
            this.street,
            100,
            'Je straatnaam mag maximaal 100 karakters lang zijn'
        );

        return errors;
    }

    /**
     * Validates the houseNumber property.
     * @returns an empty object when the property is valid,
     * an object containing an error when the property is invalid.
     * @author Thijs van Rixoort
     */
    private validateHouseNumber(): { houseNumber?: string } {
        const errors: { houseNumber?: string } = {};

        if (this.houseNumber && this.houseNumber > 65535) {
            errors['houseNumber'] = 'Je huisnummer mag maximaal 65535 zijn';
        }

        return errors;
    }

    /**
     * Validates the zipCode property.
     * @returns an empty object when the property is valid,
     * an object containing an error when the property is invalid.
     * @author Thijs van Rixoort
     */
    private validateZipCode(): { zipCode?: string } {
        const errors: { zipCode?: string } = {};

        errors['zipCode'] = this.validateStringMaxLength(
            this.zipCode,
            6,
            'Je postcode mag maximaal 6 karakters lang zijn'
        );

        return errors;
    }

    /**
     * @author Youri Janssen
     * Hashes a user's password using bcrypt with salt rounds.
     * @param {string} password - The password to be hashed.
     *   A higher value increases security but also computational cost.
     * @returns {Promise<string>} A promise that resolves to the hashed password.
     */
    public static hashPassword(password: string): Promise<string> {
        return argon2.hash(password);
    }

    /**
     * Checks if the password saved in this instance is the same as the password parameter.
     * @param password The password that you want to check, unhashed.
     * @returns true when the passwords are the same, else false.
     * @author Thijs van Rixoort
     */
    public async validatePassword(password: string): Promise<boolean> {
        let returnValue: boolean = false;

        if (this.password) {
            returnValue = await argon2.verify(this.password, password);
        }

        return returnValue;
    }

    /**
     * Deserializes a User object.
     * @returns a deserialized User object.
     * @author Thijs van Rixoort
     */
    public toJSON(): DeserializedUser {
        return {
            email: this.email,
            password: this.password,
            type: this.type,
            active: this.active,
            id: this.id,
            firstName: this.firstName,
            preposition: this.preposition,
            lastName: this.lastName,
            mobileNumber: this.mobileNumber,
            city: this.city,
            street: this.street,
            houseNumber: this.houseNumber,
            zipCode: this.zipCode
        };
    }
}
