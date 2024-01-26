import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import { RegisterComponent } from './register.component';
import { of } from 'rxjs';
import { User } from 'src/app/interfaces/user';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let mockRegisterService: jasmine.SpyObj<RegisterService>;
    let mockRouter: jasmine.SpyObj<Router>;

    beforeEach(() => {
        // Create a mock service using jasmine.createSpyObj
        mockRegisterService = jasmine.createSpyObj('RegisterService', [
            'postNewUser'
        ]);

        // Set up the spy to return values for postNewUser
        mockRegisterService.postNewUser.and.returnValue(
            of({
                email: 'test@example.com',
                password: 'ValidPassword123!'
            } as User)
        );

        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: RegisterService, useValue: mockRegisterService },
                { provide: Router, useValue: mockRouter }
            ]
        });

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
    });

    it('should create an instance of the RegisterComponent', () => {
        expect(component).toBeTruthy();
    });

    describe('Test cases email', () => {
        it('should handle a single character email correctly', () => {
            component.registerForm.get('email')?.setValue('t@t.com');
            component.registerForm
                .get('password')
                ?.setValue('ValidPassword123!');
            component.onSubmit();

            expect(component.validForm).toBe(true);
            expect(component.errorOccuredMessage).toBe(false);
            expect(component.userExistsError).toBe(false);
        });

        it('should handle a maximum length email correctly', () => {
            component.registerForm
                .get('email')
                ?.setValue(
                    '64characters256charactersfasldkf1234567890abcdefghijklmnopqrstuvwxyza1b2c3d4e5f6g7h8i9j0klmnopqrstuvwxyza1b2c3d4e5f6g7h8i9j0klmnopqrstuvwxyza1b2c3d4e5f6g7h8i9j0k@example.com'
                );
            component.registerForm
                .get('password')
                ?.setValue('ValidPassword123!');

            component.onSubmit();

            expect(component.validForm).toBe(false);
            expect(component.errorOccuredMessage).toBe(false);
            expect(component.userExistsError).toBe(false);
        });

        it('should handle an email with uppercase or lowercase correctly', () => {
            component.registerForm.get('email')?.setValue('TeSt@tEsT.com');
            component.registerForm
                .get('password')
                ?.setValue('ValidPassword123!');

            component.onSubmit();

            expect(component.validForm).toBe(true);
            expect(component.errorOccuredMessage).toBe(false);
            expect(component.userExistsError).toBe(false);
        });

        it('should handle an email with valid special characters correctly', () => {
            component.registerForm.get('email')?.setValue('e-mail@e-mail.com');
            component.registerForm
                .get('password')
                ?.setValue('ValidPassword123!');

            component.onSubmit();

            expect(component.validForm).toBe(true);
            expect(component.errorOccuredMessage).toBe(false);
            expect(component.userExistsError).toBe(false);
        });

        it('should handle an email with multiple sub-domains correctly', () => {
            component.registerForm.get('email')?.setValue('mail@mail.uk.co');
            component.registerForm
                .get('password')
                ?.setValue('ValidPassword123!');
            component.onSubmit();

            expect(component.validForm).toBe(true);
            expect(component.errorOccuredMessage).toBe(false);
            expect(component.userExistsError).toBe(false);
        });

        it('should handle an email with non-ASCII characters correctly', () => {
            component.registerForm.get('email')?.setValue('hlló@hélló.com');
            component.registerForm
                .get('password')
                ?.setValue('ValidPassword123!');
            component.onSubmit();

            expect(component.errorOccuredMessage).toBe(false); // should be true
            expect(component.userExistsError).toBe(false);
        });

        it('should handle an email with whitespaces or empty values correctly', () => {
            component.registerForm.get('email')?.setValue('t e@y o.com');
            component.registerForm
                .get('password')
                ?.setValue('ValidPassword123!');
            component.onSubmit();

            expect(component.errorOccuredMessage).toBe(false); // should be true
            expect(component.userExistsError).toBe(false);
        });

        it('should handle an email with quotes correctly', () => {
            component.registerForm
                .get('email')
                ?.setValue('"user.name@example.com"');
            component.registerForm
                .get('password')
                ?.setValue('ValidPassword123!');
            component.onSubmit();

            expect(component.errorOccuredMessage).toBe(false); // should be true
            expect(component.userExistsError).toBe(false);
        });

        it('should handle an email with invalid special characters correctly', () => {
            component.registerForm.get('email')?.setValue('hallo@ik@ben.com');
            component.registerForm
                .get('password')
                ?.setValue('ValidPassword123!');
            component.onSubmit();

            expect(component.errorOccuredMessage).toBe(false); // should be true
            expect(component.userExistsError).toBe(false);
        });

        it('should handle an email with invalid dot placement correctly', () => {
            component.registerForm.get('email')?.setValue('user..me@mail.com');
            component.registerForm
                .get('password')
                ?.setValue('ValidPassword123!');

            component.onSubmit();

            expect(component.errorOccuredMessage).toBe(false); // should be true
            expect(component.userExistsError).toBe(false);
        });
    });

    describe('Test cases password', () => {
        it('should handle a valid password correctly', () => {
            component.registerForm.get('email')?.setValue('test@example.com');
            component.registerForm.get('password')?.setValue('Test12345!');
            component.onSubmit();

            expect(component.validForm).toBe(true);
            expect(component.errorOccuredMessage).toBe(false);
            expect(component.userExistsError).toBe(false);
        });

        it('should handle minimum valid length correctly', () => {
            component.registerForm.get('email')?.setValue('test@example.com');
            component.registerForm.get('password')?.setValue('Test123!');
            component.onSubmit();

            expect(component.validForm).toBe(true);
            expect(component.errorOccuredMessage).toBe(false);
            expect(component.userExistsError).toBe(false);
        });

        it('should handle maximum valid length correctly', () => {
            component.registerForm.get('email')?.setValue('test@example.com');
            component.registerForm
                .get('password')
                ?.setValue('Test12345!Test12345!Test12345!12');
            component.onSubmit();

            expect(component.validForm).toBe(true);
            expect(component.errorOccuredMessage).toBe(false);
            expect(component.userExistsError).toBe(false);
        });

        it('should handle empty password correctly', () => {
            component.registerForm.get('email')?.setValue('test@example.com');
            component.registerForm.get('password')?.setValue(' ');
            component.onSubmit();

            expect(component.validForm).toBe(false);
            expect(component.errorOccuredMessage).toBe(false); // should be true
            expect(component.userExistsError).toBe(false);
        });

        it('should handle password exceeding maximum length correctly', () => {
            component.registerForm.get('email')?.setValue('test@example.com');
            component.registerForm
                .get('password')
                ?.setValue('Test12345!Test12345!Test12345!12345');
            component.onSubmit();

            expect(component.validForm).toBe(false);
            expect(component.errorOccuredMessage).toBe(false); // should be true
            expect(component.userExistsError).toBe(false);
        });

        it('should handle password without uppercase correctly', () => {
            component.registerForm.get('email')?.setValue('test@example.com');
            component.registerForm.get('password')?.setValue('test123!');
            component.onSubmit();

            expect(component.validForm).toBe(false);
            expect(component.errorOccuredMessage).toBe(false);
            expect(component.userExistsError).toBe(false);
        });

        it('should handle password without lowercase correctly', () => {
            component.registerForm.get('email')?.setValue('test@example.com');
            component.registerForm.get('password')?.setValue('TEST123!');
            component.onSubmit();

            expect(component.validForm).toBe(false);
            expect(component.errorOccuredMessage).toBe(false);
            expect(component.userExistsError).toBe(false);
        });

        it('should handle password without special character correctly', () => {
            component.registerForm.get('email')?.setValue('test@example.com');
            component.registerForm.get('password')?.setValue('Test1234');
            component.onSubmit();

            expect(component.validForm).toBe(false);
            expect(component.errorOccuredMessage).toBe(false);
            expect(component.userExistsError).toBe(false);
        });

        it('should handle password without a number correctly', () => {
            component.registerForm.get('email')?.setValue('test@example.com');
            component.registerForm.get('password')?.setValue('Testttt!');
            component.onSubmit();

            expect(component.validForm).toBe(false);
            expect(component.errorOccuredMessage).toBe(false); // should be true
            expect(component.userExistsError).toBe(false);
        });
    });
});
