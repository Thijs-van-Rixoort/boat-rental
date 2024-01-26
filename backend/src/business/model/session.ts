import { randomBytes } from 'crypto';

/**
 * A business model that represents a session.
 * Sessions enable users to log in and stay logged in for a certain period.
 * In this case this period is 2 weeks.
 * @author Thijs van Rixoort
 */
export class Session {
    public userId: number;

    private _id!: string;
    public get id(): string {
        return this._id;
    }
    private set id(value: string | undefined) {
        const idLength = 32;

        /* Checks whether the submitted value is undefined or not exactly 32 characters long. */
        if (value !== undefined) {
            if (value.length === idLength) {
                this._id = value;
            } else {
                throw new Error(
                    'session id is not exactly 32 characters long.'
                );
            }
        } else {
            this._id = this.createId();
        }
    }

    private _expirationDate!: Date;
    public get expirationDate(): Date {
        return this._expirationDate;
    }
    private set expirationDate(value: Date | undefined) {
        const now: Date = new Date();

        /* Checks whether the submitted value is undefined or in the past. */
        if (value !== undefined) {
            if (value >= now) {
                this._expirationDate = value;
            } else {
                throw new Error(
                    'session expiration date can not be in the past.'
                );
            }
        } else {
            this._expirationDate = this.createExpirationDate();
        }
    }

    public constructor(
        userId: number,
        id: string | undefined = undefined,
        expirationDate: Date | undefined = undefined
    ) {
        this.id = id;
        this.expirationDate = expirationDate;
        this.userId = userId;
    }

    /**
     * Creates a 32-character long id that is cryptographically strong.
     * @returns the created id.
     * @author Thijs van Rixoort
     */
    private createId(): string {
        const byteLength = 16; // Converting bytes to hexadecimals creates two hex characters for each byte.

        return randomBytes(byteLength).toString('hex');
    }

    /**
     * Creates the expiration date. The expiration date is set two weeks from now.
     * @returns the expiration date.
     * @author Thijs van Rixoort
     */
    private createExpirationDate(): Date {
        const expirationDate: Date = new Date();
        const activeSessionDays = 14;

        expirationDate.setDate(expirationDate.getDate() + activeSessionDays);

        return expirationDate;
    }
}
