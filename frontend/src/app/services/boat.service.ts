import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, Subject, takeUntil } from 'rxjs';
import { Boat } from '../interfaces/boat';

/**
 * @author Youri Janssen
 * Service for interacting with boat data.
 */
@Injectable({
    providedIn: 'root'
})
export class BoatService implements OnDestroy {
    private boatsUrl = 'http://localhost:3002/boat';
    private unsubscribe$: Subject<void> = new Subject<void>();

    /**
     * @author Youri Janssen
     * Constructor for BoatService.
     * @param http - The HttpClient module for sending HTTP requests.
     */
    constructor(private http: HttpClient) {}

    /**
     * @author Youri Janssen
     * Search boats by name.
     * @param name - The name of the boat to search for.
     * @returns An Observable of type Boat[] containing the search results.
     */
    public searchBoats(name: string, limit: number, offset: number): Observable<Boat[]> {
        const url = `${this.boatsUrl}/?name=${name}&limit=${limit}&offset=${offset}`;
        return this.http.get<Boat[]>(url).pipe(
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
