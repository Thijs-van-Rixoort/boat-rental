import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Authorization service, not to be confused with the authentication service.
 * @author Marcus K.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    /**
     * The Url used with our Http Request
     */
    private detailedDataAPI = 'http://localhost:3002/sessions/authorize';

    /**
     * The headers used with our Http Request.
     */
    private httpHeaders: HttpHeaders = new HttpHeaders().set(
        'content-type',
        'application/json'
    );

    /**
     * @method checkForAdmin is a simple post request that asks our database what kind of user this is.
     * I'll admit, not a great way of handling things, but it works.
     * @returns
     * @author Marcus K.
     */
    public checkForAdmin(): Observable<HttpResponse<undefined>> {
        return this.http.post<undefined>(this.detailedDataAPI, null, {
            headers: this.httpHeaders,
            withCredentials: true,
            observe: 'response'
        });
    }

    constructor(private router: Router, private http: HttpClient) {}

    /**
     * @method canActivate is a method specifically tailored for our routeguards. If we're good, we send back that we can access this route, else we send them elsewhere.
     * @returns
     */
    public canActivate(): Observable<boolean | UrlTree> {
        return new Observable<boolean | UrlTree>(obs => {
            return this.checkForAdmin().subscribe({
                next: (v: HttpResponse<undefined>) => {
                    if (v.status !== 204) {
                        obs.next(this.router.parseUrl('/niet-gevonden'));
                    }

                    obs.next(true);
                },
                error: () => {
                    obs.next(this.router.parseUrl('/niet-gevonden'));
                }
            });
        });
    }
}
