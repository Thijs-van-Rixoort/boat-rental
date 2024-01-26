import { Component } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegisterService } from 'src/app/services/register.service';
import { LoginComponent } from '../login/login.component';

/**
 * @author Youri Janssen
 * Component for user registration.
 */
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    /** Indicates if the form contains invalid data. */
    invalidForm = false;

    /** Indicates if the form contains valid data. */
    validForm = false;

    /** Indicates if a form submit message should be displayed. */
    formSubmitMessage = false;

    /** Indicates if a message should be displayed. */
    errorOccuredMessage = false;
    userExistsError = false;

    constructor(
        private registerService: RegisterService,
        private formBuilder: FormBuilder,
        public overlay: MatDialog,
        private dialogRef: MatDialogRef<RegisterComponent>
    ) {}

    /** Form group for user details. */
    registerForm: FormGroup = this.formBuilder.group({
        email: [
            '',
            [
                Validators.required,
                Validators.email,
                Validators.pattern(
                    /^(?=.{1,320}$)^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
            ]
        ],
        password: [
            '',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(32),
                Validators.pattern(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/
                )
            ]
        ]
    });

    /**
     * @author Youri Janssen
     * Checks if a specific form control is invalid based on certain conditions.
     * @param {string} controlName - The name of the form control to check.
     * @returns {boolean} True if the form control is invalid and meets the specified conditions, otherwise false.
     */
    isFormControlInvalid(controlName: string): boolean {
        const control: AbstractControl | null =
            this.registerForm.get(controlName);
        // If the control doesn't exist, it's not invalid
        if (!control) {
            return false;
        }
        const isInvalid: boolean = control.invalid;
        const formSubmitted: boolean = this.invalidForm;
        return isInvalid && formSubmitted;
    }

    /**
     * @author Youri Janssen
     * @function onSubmit Handles the submission of the sign-up form.
     * If the form is valid, it triggers the register service to post the new user data.
     * If the form is invalid, it sets the `invalidForm` flag to true.
     */
    onSubmit(): void {
        // Reset the form status
        this.invalidForm = false;
        this.errorOccuredMessage = false;
        this.validForm = false;
        this.userExistsError = false;

        // call the form validation
        if (!this.registerForm.valid) {
            this.userExistsError = false;
            this.invalidForm = true;
            return;
        }

        // form submitted message
        this.formSubmitMessage = true;

        //call the register service
        this.registerService.postNewUser(this.registerForm).subscribe({
            next: () => {
                this.validForm = true;
                this.formSubmitMessage = false;
                this.userExistsError = false;
                setTimeout(() => {
                    this.registerForm.reset();
                    this.switchToLoginOverlay();
                }, 2000);

            },
            error: (error: any) => {
                if (error.status === 409) {
                    this.userExistsError = true;
                } else {
                    console.error('Error submitting while signing up:', error);
                }
                this.formSubmitMessage = false;
                this.errorOccuredMessage = true;
            }
        });
    }
    /**
     * Closes the login pop-up.
     * @author Thijs van Rixoort (and added by Marcus K.)
     */
    public closeOverlay(): void {
        this.dialogRef.close();
    }

    /**
     * Switches pop-up dialog from login overlay to register overlay.
     * @author Marcus K. & Thijs van Rixoort
     */
    public switchToLoginOverlay(): void {
        this.dialogRef.close();
        this.overlay.open(LoginComponent, {
            width: '50%'
        });
    }
}
