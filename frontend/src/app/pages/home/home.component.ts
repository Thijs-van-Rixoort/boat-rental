import { Component } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    constructor(private headerService: HeaderService) {
        this.assignHeaderData();
    }

    /**
     * @function assignHeaderData is dedicated to giving data to the Header Service so it knows that to display on this webpage.
     * @param headerTitle
     * @author Marcus K.
     */
    private assignHeaderData(): void {
        this.headerService.assignHeaderData({
            title: 'Startpagina',
            biggerBanner: false,
            search: false,
            colour: '#456ed8'
        });
    }
}
