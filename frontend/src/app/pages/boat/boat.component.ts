import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Boat } from 'src/app/interfaces/boat';
import { BoatService } from 'src/app/services/boat.service';
import { HeaderService } from 'src/app/services/header.service';

/**
 * Boat component for displaying and searching boats.
 * @author Youri Janssen & Thijs van Rixoort
 */
@Component({
    selector: 'app-boat',
    templateUrl: './boat.component.html',
    styleUrls: ['./boat.component.css']
})
export class BoatComponent implements OnInit {
    /** An array of Boat objects that match the search criteria. */
    public searchedBoats: Boat[] = [];
    public searchTerm = '';
    private limit = 20;
    public error = '';

    /**
     * @author Youri Janssen & Thijs van Rixoort
     * Creates an instance of BoatComponent.
     * @param boatService - The BoatService used to search for boats.
     */
    constructor(
        private boatService: BoatService,
        private headerService: HeaderService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.assignHeaderData();
        this.headerService.getSearchQuery().subscribe(value => {
            this.searchBoats(value);
        });
    }

    /**
     * Updates the properties of this component according to the query parameters passed in the URL.
     * Sends a request to the backend right after, so the user immediately receives the correct boats.
     * @author Thijs van Rixoort
     */
    public ngOnInit(): void {
        this.route.queryParams.subscribe((params: Params) => {
            this.searchTerm = params['naam'] === undefined ? '' : params['naam'];
            this.limit = params['limiet'] === undefined || typeof parseInt(params['limiet']) !== 'number' ? 20 : params['limiet'];
        });

        this.searchBoats(this.searchTerm);
    }

    /**
     * @function assignHeaderData is dedicated to giving data to the Header Service so it knows that to display on this webpage.
     * @param headerTitle
     * @author Marcus K.
     */
    private assignHeaderData(): void {
        this.headerService.assignHeaderData({
            title: 'Boten te huur',
            biggerBanner: true,
            search: true,
            colour: '#456ed8'
        });
    }

    /**
     * @author Youri Janssen & Thijs van Rixoort
     * Searches for boats based on the provided name.
     * @param searchTerm - The searchTerm of the boat to search for.
     */
    public searchBoats(searchTerm: string): void {
        this.error = '';
        if (searchTerm.length > 150) {
            alert('The boat name cannot contain more than 150 characters.');
            return;
        }

        this.updateQueryParams(searchTerm);

        this.boatService.searchBoats(searchTerm, this.limit, 0).subscribe(
            data => {
                if (data.length < this.limit) {
                    this.error = "Er zijn geen boten meer om op te halen."
                }
                this.searchedBoats = data;
                this.checkAlphabeticalOrder();
            },
            error => {
                console.error('An error occurred:', error);
            }
        );
    }

    /**
     * Searches for more boats to append to the existing searchedBoats property.
     * @author Thijs van Rixoort
     */
    public searchMoreBoats(): void {
        if (this.searchTerm.length > 150) {
            alert('The boat name cannot contain more than 150 characters.');
            return;
        }

        this.updateQueryParams(this.searchTerm);

        this.boatService.searchBoats(this.searchTerm, this.limit, this.searchedBoats.length).subscribe(
            {
                next: (data: Boat[]) => {
                    if (data.length < this.limit) {
                        this.error = "Er zijn geen boten meer om op te halen."
                    }
                    this.searchedBoats = this.searchedBoats.concat(data);
                    this.checkAlphabeticalOrder();
                },
                error: (error: HttpErrorResponse) => {
                    console.error('An error occurred:', error);
                }
            }
        );
    }

    /**
     * @author Youri Janssen
     * Checks if the Boat names are returned in alphabetical order.
     * @returns A boolean value indicating whether the names are in alphabetical order.
     */
    checkAlphabeticalOrder(): boolean {
        for (let i = 0; i < this.searchedBoats.length - 1; i++) {
            // Check if the current element is greater than the next element
            if (
                this.searchedBoats[i].name.localeCompare(
                    this.searchedBoats[i + 1].name
                ) > 0
            ) {
                // Return false if the current element is greater than the next element
                return false;
            }
        }
        return true;
    }

    /**
     * Updates the query parameters in the url.
     * @author Thijs van Rixoort
     */
    private updateQueryParams(searchTerm: string): void {
        const updatedParams: Params = { naam: searchTerm, limiet: this.limit };

        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: updatedParams,
                queryParamsHandling: 'merge'
            }
        );
        this.assignHeaderData();
    }
}
