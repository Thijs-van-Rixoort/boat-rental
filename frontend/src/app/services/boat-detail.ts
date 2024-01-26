import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @type BoatData is all the data I'm *expecting* to recieve from the back-end
 */
export type BoatData = {
    active: boolean;
    brandName: string;
    capacity: number;
    description: string;
    fabricationYear: number;
    facilityArray: string[];
    id: number;
    imageArray: string[];
    length: number;
    licenseRequired: boolean;
    model: string;
    modelId: number;
    name: string;
    price: number | string;
    skipperRequired: boolean;
};

@Injectable({
    providedIn: 'root'
})

/**
 * @class BoatDetailService is a simple Angular service dedicated to getting boat data from the back-end to send to the webpage.
 * @author Marcus K.
 */
export class BoatDetailService {
    //The link to our API, which we retrieve our data from!
    private detailedDataAPI = 'http://localhost:3002/boat/detailed';

    //Header options we're assigning here to not overbulk getBoatDetails
    private httpHeaders: HttpHeaders = new HttpHeaders().set(
        'content-type',
        'application/json'
    );

    //As I'm using queryParameters on my route, this one assigns query parameters!
    private queryParameters(id: number): HttpParams {
        return new HttpParams({ fromString: 'id=' + id });
    }

    public constructor(private http: HttpClient) {}

    /**
     * @function getBoatDetails simply makes a GET request to our backend with the given boatId and headers.
     * @param id is the id of a boat we're looking for
     * @returns all boat data upon success.
     */
    public getBoatDetails(id: number): Observable<BoatData> {
        return this.http.get<BoatData>(this.detailedDataAPI, {
            headers: this.httpHeaders,
            params: this.queryParameters(id)
        });
    }
}
