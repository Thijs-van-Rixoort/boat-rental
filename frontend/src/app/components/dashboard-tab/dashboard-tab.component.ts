import { Component } from '@angular/core';
import { TabData, TabService } from 'src/app/services/tab.service';

@Component({
    selector: 'app-dashboard-tab',
    templateUrl: './dashboard-tab.component.html',
    styleUrls: ['./dashboard-tab.component.css']
})

/**
 * Very simple tab component. This is mostly a decorative wrapper for the admin's child pages.
 * @author Marcus K.
 */
export class DashboardTabComponent {
    public tabs: {title?: string, colour?: string }[] = [];

    constructor( private tabService: TabService) {
        this.tabService.getTabData().subscribe((value: TabData) => {
            this.tabs = value;
        });
    }

    public activeTab = 0;

}
