/**
 * Represents a User object with its properties.
 * @author Youri Janssen & Thijs van Rixoort
 */
export interface User {
    email?: string;
    password?: string;
    active?: number;
    id?: number;
    firstName?: string;
    preposition?: string;
    lastName?: string;
    mobileNumber?: string;
    city?: string;
    street?: string;
    houseNumber?: number;
    zipCode?: string;
}
