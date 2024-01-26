import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { newBoatData } from '../components/create-boat/create-boat.component';

@Injectable({
    providedIn: 'root'
})

/**
 * A very simple service dedicated to creating a brand new boat.
 * @author Marcus K.
 */
export class CreateBoatService {
    /**
     * The Url used with our Http Request
     */
    private detailedDataAPI = 'http://localhost:3002/boat';

    /**
     * The headers used with our Http Request.
     */
    private httpHeaders: HttpHeaders = new HttpHeaders().set(
        'content-type',
        'application/json'
    );

    public constructor(private http: HttpClient) {}

    /**
     * @method createNewBoat is dedicated to sending a post request to our database for creating a brand new boat.
     * @param newBoat is an object containing all the data a new boat would have.
     * @returns either that it succeeded or why it failed in a HttpResponse.
     */
    public createNewBoat(
        newBoat: newBoatData
    ): Observable<HttpResponse<string> | HttpErrorResponse> {
        return this.http.post<string>(this.detailedDataAPI, newBoat, {
            headers: this.httpHeaders,
            withCredentials: true,
            observe: 'response'
        });
    }
}
