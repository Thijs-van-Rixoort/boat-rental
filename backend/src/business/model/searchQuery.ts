/**
 * Encapsulates the logic for handling search queries in an object-oriented manner.
 * Represents a search query for boats.
 * @author Youri Janssen & Thijs van Rixoort
 */
export class SearchQuery {
    private name: string;

    /**
     * @author Youri Janssen
     * Creates an instance of SearchQuery.
     * @param {string} name - The search query string.
     */
    constructor(name: string) {
        this.name = name;
    }

    /**
     * Validates the search query.
     * @returns {null|string[]} Null if the query is valid, otherwise an array of error messages.
     * @author Youri Janssen & Thijs van Rixoort
     */
    public validateQuery(): null | string[] {
        const errors: string[] = [];

        if (this.name.length > 150) {
            errors.push(
                'A search query cannot contain more than 150 characters'
            );
        }
        if (errors.length > 0) {
            return errors;
        } else {
            return null;
        }
    }
}
