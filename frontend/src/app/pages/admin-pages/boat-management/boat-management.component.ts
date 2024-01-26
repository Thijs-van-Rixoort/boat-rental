import { Component } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { TabService } from '../../../services/tab.service';

@Component({
    selector: 'app-boat-management',
    templateUrl: './boat-management.component.html',
    styleUrls: ['./boat-management.component.css']
})
export class BoatManagementComponent {
    constructor(
        private headerService: HeaderService,
        private tabService: TabService
    ) {
        this.assignHeaderData();
        this.assignTabData();
    }

    /**
     * @function assignHeaderData is dedicated to giving data to the Header Service so it knows that to display on this webpage.
     * @param headerTitle
     * @author Marcus K.
     */
    private assignTabData(): void {
        this.tabService.assignTabData([
            { title: 'Boot Aanmaken', colour: '#456ececc' },
        ]);
    }

    /**
     * @function assignHeaderData is dedicated to giving data to the Header Service so it knows that to display on this webpage.
     * @param headerTitle
     * @author Marcus K.
     */
    private assignHeaderData(): void {
        this.headerService.assignHeaderData({
            title: 'Admin - Botenbeheer',
            colour: '#CF1509'
        });
    }
}
