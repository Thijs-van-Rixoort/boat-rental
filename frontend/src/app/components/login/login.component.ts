import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SessionService } from 'src/app/services/session.service';
import { RegisterComponent } from '../register/register.component';

/**
 * A component used for logging in.
 * @author Thijs van Rixoort
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    public error = '';

    loginForm: FormGroup = this.formBuilder.group({
        email: [
            '',
            [
                Validators.required
            ]
        ],
        password: [
            '',
            [
                Validators.required
            ]
        ]
    });

    constructor(
        private sessionService: SessionService,
        private formBuilder: FormBuilder,
        public overlay: MatDialog,
        private dialogRef: MatDialogRef<LoginComponent>,
        private authService: AuthenticationService
    ) {}

    /**
     * Closes the login pop-up.
     * @author Thijs van Rixoort
     */
    public closeOverlay(): void {
        this.dialogRef.close();
    }

    /**
     * Switches pop-up dialog from login overlay to register overlay.
     * @author Marcus K. & Thijs van Rixoort
     */
    public switchToRegisterOverlay(): void {
        this.dialogRef.close();
        this.overlay.open(RegisterComponent, {
            width: '50%'
        });
    }
    /**
     * Sends a request to the back end to create a session.
     * When a user submitted existing accountdata they receive a session token in a cookie.
     * When the user submitted invalid or non-existent data, they receive an error.
     * @author Thijs van Rixoort
     */
    public onSubmit(): void {
        const email: string = this.loginForm.value.email;
        const password: string = this.loginForm.value.password;

        if (this.loginForm.invalid) {
            this.error = 'Het e-mailadres of wachtwoord veld is nog leeg.';
        } else {
            this.login(email, password);
        }
    }

    /**
     * Calls the login method on the sessionService which in turn sends a request to the backend. 
     * @param email The email address the user submitted.
     * @param password The password the user submitted.
     * @author Thijs van Rixoort
     */
    private login(email: string, password: string): void {
        this.sessionService.login(email, password).subscribe({
            error: (response: HttpErrorResponse) => {
                this.error = response.error;
            },
            complete: () => {
                this.authService.isUserLoggedIn.next(true);
                this.closeOverlay();
            }
        });
    }
}
