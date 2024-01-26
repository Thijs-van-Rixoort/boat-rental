import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionService } from 'src/app/services/session.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    let mockSessionService: jasmine.SpyObj<SessionService>;
    let mockAuthenticationService: jasmine.SpyObj<AuthenticationService>;
    let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<LoginComponent>>;

    beforeEach(() => {
        mockSessionService = jasmine.createSpyObj('SessionService', [
            'login'
        ]);

        mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', [
            'close'
        ]);

        mockAuthenticationService = {
            isUserLoggedIn: new BehaviorSubject<boolean>(true)
        }

        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [ReactiveFormsModule],
            providers: [
                {provide: SessionService, useValue: mockSessionService},
                {provide: MatDialogRef, useValue: mockMatDialogRef },
                {provide: AuthenticationService, useValue: mockAuthenticationService}
            ]
        });

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be able to be created', () => {
        expect(component).toBeTruthy();
    });

    it(`should be able to log a user in`, () => {
        // Arrange
        mockSessionService.login.and.returnValue(
            of('')
        );

        component.loginForm.get('email')?.setValue('thijs@gmail.com');
        component.loginForm.get('password')?.setValue('Strongpw123!');
        component.onSubmit();

        const expected = true;
    
        // Act
        const actual: boolean = mockAuthenticationService.isUserLoggedIn.value;
    
        // Assert
        expect(actual).toBe(expected);
    });

    describe(`e-mail & password field checks`, () => {
        it(`should show an error when the e-mail field is empty`, () => {
            // Arrange
            component.loginForm.get('email')?.setValue('');
            component.loginForm.get('password')?.setValue('Strongpw123!');
            component.onSubmit();

            const expected = "Het e-mailadres of wachtwoord veld is nog leeg.";
        
            // Act
            const actual: string = component.error;
        
            // Assert
            expect(actual).toBe(expected);
        });

        it(`should show an error when the password field is empty`, () => {
            // Arrange
            component.loginForm.get('email')?.setValue('thijs@gmail.com');
            component.loginForm.get('password')?.setValue('');
            component.onSubmit();

            const expected = "Het e-mailadres of wachtwoord veld is nog leeg.";
        
            // Act
            const actual: string = component.error;
        
            // Assert
            expect(actual).toBe(expected);
        });

        it(`should show an error when the e-mail and password fields are empty`, () => {
            // Arrange
            component.loginForm.get('email')?.setValue('');
            component.loginForm.get('password')?.setValue('');
            component.onSubmit();

            const expected = "Het e-mailadres of wachtwoord veld is nog leeg.";
        
            // Act
            const actual: string = component.error;
        
            // Assert
            expect(actual).toBe(expected);
        });
    });

    describe(`e-mail & password error checks`, () => {
        it(`should show an error when the submitted e-mail is incorrect`, () => {
            // Arrange
            mockSessionService.login.and.returnValue(
                throwError(() => new HttpErrorResponse({error: "Het e-mailadres of wachtwoord klopt niet."}))
            );
            component.loginForm.get('email')?.setValue('invalid@email.com');
            component.loginForm.get('password')?.setValue('Strongpw123!');
            component.onSubmit();

            const expected = "Het e-mailadres of wachtwoord klopt niet.";
        
            // Act
            const actual: string = component.error;
        
            // Assert
            expect(actual).toBe(expected);
        });

        it(`should show an error when the submitted password is incorrect`, () => {
            // Arrange
            mockSessionService.login.and.returnValue(
                throwError(() => new HttpErrorResponse({error: "Het e-mailadres of wachtwoord klopt niet."}))
            );
            component.loginForm.get('email')?.setValue('thijs@gmail.com');
            component.loginForm.get('password')?.setValue('IncorrectPassword123!');
            component.onSubmit();

            const expected = "Het e-mailadres of wachtwoord klopt niet.";
        
            // Act
            const actual: string = component.error;
        
            // Assert
            expect(actual).toBe(expected);
        });

        it(`should show an error when the submitted e-mail and password are both incorrect`, () => {
            // Arrange
            mockSessionService.login.and.returnValue(
                throwError(() => new HttpErrorResponse({error: "Het e-mailadres of wachtwoord klopt niet."}))
            );
            component.loginForm.get('email')?.setValue('invalid@email.com');
            component.loginForm.get('password')?.setValue('IncorrectPassword123!');
            component.onSubmit();

            const expected = "Het e-mailadres of wachtwoord klopt niet.";
        
            // Act
            const actual: string = component.error;
        
            // Assert
            expect(actual).toBe(expected);
        });
    });
});
