import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { HeaderService } from 'src/app/services/header.service';
import { BoatDetailService, BoatData } from 'src/app/services/boat-detail';

@Component({
    selector: 'app-boat-details',
    templateUrl: './boat-details.component.html',
    styleUrls: ['./boat-details.component.css']
})

/**
 * The component logic for boat-details. This retrieves all boat data and displays it, or redirects the user elsewhere.
 * @author Marcus K.
 */
export class BoatDetailsComponent implements OnInit {
    faArrowLeft = faArrowLeft;

    boatdata: BoatData | null = null;
    thumbnail = '';

    currentThumbnail = 0;
    imageArrayLength = 0;

    detailsArray: {
        contentTitle: string;
        contentValue: string | number;
    }[] = [];

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private boatDetailService: BoatDetailService,
        private titleService: Title,
        private headerService: HeaderService
    ) {}

    ngOnInit() {
        const boatId: number | undefined = this.grabQueryParameter();
        if (boatId) {
            this.loadWebpage(boatId);
        }
    }

    /**
     * @function assignHeaderData is dedicated to giving data to the Header Service so it knows that to display on this webpage.
     * @param headerTitle
     * @author Marcus K.
     */
    private assignHeaderData(headerTitle: string): void {
        this.headerService.assignHeaderData({
            title: headerTitle,
            biggerBanner: false,
            search: false,
            colour: '#456ed8'
        });
    }

    /**
     * @function grabQueryParameter simply looks if there's a parameter in the header. If there is it gets returned. If there isn't, the user gets send to our 404 page.
     * @author Marcus K.
     */
    private grabQueryParameter(): number | undefined {
        const routeParameter: string | null =
            this.route.snapshot.paramMap.get('bootId');

        if (routeParameter) {
            return parseInt(routeParameter);
        } else {
            this.pageNotFound();
            return;
        }
    }

    /**
     * @function loadWebpage calls the service to make a GET request to the back end for data with this boatId, then builds the website with this data.
     * If it fails, it sends the user to our 404 page.
     * @param boatId is the ID of the boat that we want data from.
     * @author Marcus K.
     */
    private loadWebpage(boatId: number): void {
        this.boatDetailService.getBoatDetails(boatId).subscribe({
            next: (incomingBoatDetails: BoatData) => {
                this.assignData(incomingBoatDetails);
            },
            error: (error: Error) => {
                console.error(error);
                this.pageNotFound();
            },
            complete: () => {
                return;
            }
        });
    }

    /**
     * @function assignData calls a fuction which creates an object with the given data and then calls other fuctions to assign that data to.
     * If the boat is not set to active, the user will be redirected to our 404 page.
     * @param incomingBoatDetails is all the incoming data about a boat recieved from the back-end.
     * @author Marcus K.
     */
    private assignData(incomingBoatDetails: BoatData): void {
        if (incomingBoatDetails.active === true) {
            const boatDetails: BoatData =
                this.createDataObject(incomingBoatDetails);

            this.boatdata = boatDetails;
            this.assignPageData(boatDetails);
            this.setAdditionalData(boatDetails);
        } else {
            this.pageNotFound();
        }
    }

    /**
     * @function setAdditionalData changes data not on this webpage itself, like the header or tab title.
     * @param boatDetails is an object with the data about a given boat.
     * @author Marcus K.
     */
    private setAdditionalData(boatDetails: BoatData): void {
        this.assignHeaderData('Bootinformatie | ' + boatDetails.name);
        const modelValue: string = boatDetails.model ? boatDetails.model : 'Boot';
        this.titleService.setTitle(
            modelValue + ' - ' + boatDetails.name
        );
    }

    /**
     * @function changeImage changes the value of what image to display on the page's main thumbnail by going either to the next or previous one.
     * @param direction is simply whether you want the 'next' or 'previous' image.
     * @author Marcus K.
     */
    public changeImage(direction: string): void {
        if (this.boatdata) {
            let newPosition: number = this.currentThumbnail;
            if (this.currentThumbnail - 1 >= 0 && direction === 'previous') {
                this.currentThumbnail--;
                newPosition = this.currentThumbnail;
            } else if (
                this.currentThumbnail + 1 < this.imageArrayLength &&
                direction === 'next'
            ) {
                this.currentThumbnail++;
                newPosition = this.currentThumbnail;
            }
            this.thumbnail = this.boatdata.imageArray[newPosition];
        }
    }

    /**
     * @function setImage runs when clicked on an image, and updates the values that keeps track of which image is currently the thumbnail
     * @param newPosition is the position in the array of the image clicked upon in the list.
     * @author Marcus K.
     */
    public setImage(newPosition: number): void {
        if (this.boatdata) {
            this.currentThumbnail = newPosition;
            this.thumbnail = this.boatdata.imageArray[newPosition];
        }
    }

    /**
     * @function createDataObject takes incoming boatdata and converts any values if they need to be converted.
     * @param boatData is all the incoming data about a boat recieved from the back-end.
     * @author Marcus K.
     */
    private createDataObject(boatData: BoatData): BoatData {
        return {
            active: boatData.active,
            brandName: boatData.brandName,
            capacity: boatData.capacity,
            description: boatData.description,
            fabricationYear: boatData.fabricationYear,
            facilityArray: boatData.facilityArray,
            id: boatData.id,
            imageArray: boatData.imageArray,
            length: boatData.length,
            licenseRequired: boatData.licenseRequired,
            model: boatData.model,
            modelId: boatData.modelId,
            name: boatData.name,
            price: '€' + (Number(boatData.price) / 100).toFixed(2),
            skipperRequired: boatData.skipperRequired
        };
    }

    /**
     * @function assignPageData assigns the data set in @function createDataObject to the webpage itself
     * @param boatData is an object with the data about a given boat.
     * @author Marcus K.
     */
    private assignPageData(boatData: BoatData): void {
        if (boatData) {
            this.thumbnail = boatData.imageArray[0];
            this.imageArrayLength = boatData.imageArray.length;
            this.detailsArray = [
                {
                    contentTitle: 'Boot naam',
                    contentValue: boatData.name
                },
                {
                    contentTitle: 'Boot merk',
                    contentValue: boatData.brandName
                },
                {
                    contentTitle: 'Boot model',
                    contentValue: boatData.model
                },
                {
                    contentTitle: 'Bouwjaar',
                    contentValue: boatData.fabricationYear
                },
                { contentTitle: 'Lengte', contentValue: boatData.length },
                {
                    contentTitle: 'Capaciteit',
                    contentValue: boatData.capacity
                }
            ];
        }
    }

    /**
     * @function goBack is a very simple function that just calls location.back()
     * This sends the user to the last path in their browser.
     * @author Marcus K.
     */
    public goBack(): void {
        this.location.back();
    }

    /**
     * @function pageNotFound simply does a redirect to our 404 page without changing the route, so that the return button doesn't die.
     * @author Marcus K.
     */
    private pageNotFound(): void {
        this.router.navigate(['not-found'], {
            skipLocationChange: true
        });
    }
}
