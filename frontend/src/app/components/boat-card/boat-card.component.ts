import { Component, Input } from '@angular/core';
import { Boat } from 'src/app/interfaces/boat';

/**
 * The boat-card component class.
 * This class contains a property named 'boat'.
 * This property is used in the template to display the data of a boat.
 * @author Thijs van Rixoort
 */
@Component({
  selector: 'app-boat-card',
  templateUrl: './boat-card.component.html',
  styleUrls: ['./boat-card.component.css']
})
export class BoatCardComponent {
    @Input()
    public boat!: Boat;
}
