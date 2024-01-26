import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Session service used for any session-related network and data tasks.
 * @author Thijs van Rixoort
 */
@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private sessionUrl = 'http://localhost:3002/sessions/';
    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
    };

    public constructor(private http: HttpClient) {}

    /**
     * Sends a request to create a login session the back end.
     * @param email The email address the user submitted.
     * @param password The password the user submitted.
     * @returns an observable that returns the response containing either a cookie or an error.
     * @author Thijs van Rixoort
     */
    public login(email: string, password: string): Observable<string | HttpErrorResponse> {
        return this.http.post<string>(
            this.sessionUrl,
            { email: email, password: password },
            this.httpOptions
        );
    }

    /**
     * Send a request to delete a session in the back end.
     * @returns an observable that returns the json body of the response.
     * @author Thijs van Rixoort
     */
    public logout(): Observable<object> {
        return this.http.delete(this.sessionUrl, this.httpOptions);
    }
}
