import {
    Component,
    ElementRef,
    Input,
    Renderer2,
    ViewChild
} from '@angular/core';
import {
    IconDefinition,
    faCircleUser,
    faMagnifyingGlass,
    faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HeaderService } from 'src/app/services/header.service';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    /** An array of Boat objects that match the search criteria. */
    public searchQuery = '';

    public isAdmin = false;

    /**
     * The @Input userData would change what letters to render on the webpage if an user is logged in, only the first 2 get grabbed. Never let it default.
     * @var firstName is a string representing a user's first name.
     * @var lastName is a string representing a user's first name.
     * @author Marcus K.
     */
    @Input() userData: { firstName: string; lastName: string } = {
        firstName: 'John',
        lastName: 'Doe'
    };

    @ViewChild('dropdown') dropdown!: ElementRef;
    @ViewChild('userButton') userButton!: ElementRef;

    public pageType: {
        title?: string;
        biggerBanner?: boolean;
        search?: boolean;
        colour?: string;
    } = {};

    /**
     * The constructor holds a simple function to detect if someone is clicking on the dropdown or not. Fires per click, might be a resource hog?
     * @var renderer is the Renderer on the HeaderComponent. We're not allowed to use @ViewChild iirc, but this is the recommended method.
     * @param overlay A MatDialog object that is used for the login overlay.
     * @param authService An authentication service used to check wether the user is logged in or not.
     * @author Marcus K & Thijs van Rixoort
     */
    constructor(
        private renderer: Renderer2,
        public overlay: MatDialog,
        private authService: AuthenticationService,
        private authorisationService: AuthService,
        private headerService: HeaderService,
        private sessionService: SessionService
    ) {
        this.renderer.listen('window', 'click', (clickEvent: Event) =>
            this.dropdownOff(clickEvent)
        );
        this.logInState();

        this.headerService.getHeaderData().subscribe(value => {
            this.pageType = value;
        });

        this.adminCheck();
    }

    public faMagnifyingGlass: IconDefinition = faMagnifyingGlass;
    public faCircleUser: IconDefinition = faCircleUser;
    public faShoppingCart: IconDefinition = faShoppingCart;

    public loggedIn = true;
    public dropdownVisible = false;

    /**
     * @function dropdownToggle is an extremely simple function which flips the boolean of the dropdown's visibility
     * @author Marcus K.
     */
    dropdownToggle(): void {
        this.dropdownVisible = !this.dropdownVisible;
    }

    /**
     * @function dropdownOff checks whenever the user clicks on the page, if it's not part of the dropdown, it closes the dropdown.
     * @var clickEvent is simply the event of where the user pressed.
     * @author Marcus K.
     */
    dropdownOff(clickEvent: Event): void {
        if (
            this.userButton &&
            this.dropdown &&
            clickEvent.target !== this.userButton.nativeElement &&
            clickEvent.target !== this.dropdown.nativeElement
        ) {
            this.dropdownVisible = false;
        }
    }

    /**
     * @function logInState is a simple check to see if there is a cookie for a user, if so it enables the logged in rendering.
     * @author Marcus K & Thijs van Rixoort
     */
    logInState(): void {
        this.authService.isUserLoggedIn.subscribe(value => {
            this.loggedIn = value;
        });
    }

    /**
     * @function logOut simply expires the session token to log them out and then reloads the page.
     * This is not Angular standard, and goes against what single page apps stand for, so this isn't a permanent solution.
     * @author Marcus K & Thijs van Rixoort
     */
    logOut(): void {
        this.sessionService.logout().subscribe({
            complete: () => {
                this.authService.isUserLoggedIn.next(false);
            }
        });
    }

    /**
     * Opens a login pop-up dialog containing a simple form.
     * @author Thijs van Rixoort
     */
    public openLoginOverlay(): void {
        this.overlay.open(LoginComponent, {
            width: '50%'
        });
    }

    /**
     * Calls all search functionality in the boat list component that has it.
     * @author Marcus K.
     */
    public runSearchQuery(searchTerm: string): void {
        this.headerService.assignQueryData(searchTerm);
    }

    /**
     * @method adminCheck runs a simple check to see if the user is an admin or not, depending on that it shows the button to the panel.
     * This is a bit buggy, as it of course errors when not an admin or that it needs a reload to update the menus, but for the rest it works fine.
     * @author Marcus K.
     */
    private adminCheck(): void {
        this.authorisationService.checkForAdmin().subscribe({
            complete: () => {
                this.isAdmin = true;
            }
        });
    }
}
