import { Component } from '@angular/core';
import { HeaderService } from 'src/app/services/header.service';
import { TabService } from 'src/app/services/tab.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent {
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
    private assignHeaderData(): void {
        this.headerService.assignHeaderData({
            title: 'Admin - Overzicht',
            colour: '#CF1509'
        });
    }

    /**
     * @function assignHeaderData is dedicated to giving data to the Header Service so it knows that to display on this webpage.
     * @param headerTitle
     * @author Marcus K.
     */
    private assignTabData(): void {
        this.tabService.assignTabData([
            { title: 'Dashboard Overzicht', colour: '#CF1509cc' }
        ]);
    }
}
