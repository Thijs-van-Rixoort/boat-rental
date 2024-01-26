import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-button-list',
    templateUrl: './button-list.component.html',
    styleUrls: ['./button-list.component.css']
})
export class ButtonListComponent {
    @Input() buttons: { title: string; colour: string; routerLink: string }[] =
        [];
}
