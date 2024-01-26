import { Component } from '@angular/core';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
    public tabArray: { title: string; colour: string }[] = [];
    /**
     * Very simple list of pages existing in the admin dashboard.
     * @author Marcus K.
     */
    public buttonArray = [
        { title: 'Overzicht', colour: '#CF1509cc', routerLink: './overzicht' },
        {
            title: 'Botenbeheer',
            colour: '#456ececc',
            routerLink: './botenbeheer'
        }
    ];
}
