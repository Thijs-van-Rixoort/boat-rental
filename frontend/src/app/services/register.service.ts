import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';
import { Observable, Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

/**
 * @author Youri Janssen //entire file
 * Service responsible for handling register-related data and API requests.
 */
@Injectable({
    providedIn: 'root'
})
export class RegisterService implements OnDestroy {
    private readonly userUrl: string = `http://localhost:3002/register`;
    private unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * @param {HttpClient} http - The Angular HttpClient to make HTTP requests.
     */
    constructor(private http: HttpClient) {}

    /**
     * @author Youri Janssen
     * @function postNewUser Posts new user data to the server.
     * @param {FormGroup} regiserForm The Angular FormGroup containing the user details.
     * @returns {Observable<User>} An Observable of User representing the posted user data.
     */
    public postNewUser(registerForm: FormGroup): Observable<User> {
        const url = `${this.userUrl}`;
        return this.http.post<User>(url, registerForm.value).pipe(
            catchError(error => {
                throw error;
            }),
            takeUntil(this.unsubscribe$)
        );
    }

    /**
     * @author Youri Janssen
     * Performs necessary cleanup when the service instance is destroyed.
     * Unsubscribes from any active subscriptions to prevent memory leaks.
     */
    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
