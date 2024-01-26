import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * An authentication service that can be used to check wether users are logged in or not.
 * @author Thijs van Rixoort
 */
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    /**
     * A BehaviorSubject<boolean>
     * Whenever the value is updated, the components using this property will automatically receive the updated value.
     * @author Thijs van Rixoort
     */
    public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(
        document.cookie.includes('session_token')
    );
}
