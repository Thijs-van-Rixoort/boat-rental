import { Component } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { HeaderService } from 'src/app/services/header.service';

@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html',
    styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent {
    faArrowLeft = faArrowLeft;

    errorCode = 404;
    errorMessage = 'Page Not Found';

    constructor(
        private location: Location,
        private headerService: HeaderService
    ) {
        this.assignHeaderData();
    }

    /**
     * @function assignHeaderData is dedicated to giving data to the Header Service so it knows that to display on this webpage.
     * @param headerTitle
     * @author Marcus K.
     */
    private assignHeaderData(): void {
        this.headerService.assignHeaderData({
            title: 'Uh-oh!',
            biggerBanner: false,
            search: false,
            colour: '#456ed8'
        });
    }

    /**
     * goBack is a very simple function that just calls location.back()
     * This sends the user to the last path in their browser.
     * @author Marcus K.
     */
    public goBack(): void {
        this.location.back();
    }
}
