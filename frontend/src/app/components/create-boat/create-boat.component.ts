import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateBoatService } from 'src/app/services/create-boat.service';

export type newBoatData = {
    name: string;
    price: number;
    description: string;
    capacity: number;
    fabricationYear: number;
    length: number;
    brandname: string;
    model: string;
    imageArray: string[];
    facilityArray: string[];
    active: boolean;
    skipperRequired: boolean;
    licenseRequired: boolean;
};

@Component({
    selector: 'app-create-boat',
    templateUrl: './create-boat.component.html',
    styleUrls: ['./create-boat.component.css']
})
export class CreateBoatComponent {
    public thumbnailId = 0;
    public imageArray: string[] = [];
    public facilityArray: string[] = [];
    public newUrl?: string;
    public newFacility?: string;

    public status = '';

    /**
     * A very simple form to do a font end check on the data, this helps out the user pre-post request.
     * @author Marcus K.
     */
    createBoatForm: FormGroup = this.formBuilder.group({
        title: [
            undefined,
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100)
            ]
        ],
        price: [
            0,
            [Validators.required, Validators.min(0), Validators.max(16777215)]
        ],
        description: [
            undefined,
            [Validators.minLength(1), Validators.maxLength(255)]
        ],
        capacity: [
            1,
            [Validators.required, Validators.min(1), Validators.max(255)]
        ],
        year: [
            new Date().getFullYear(),
            [Validators.min(1), Validators.max(4294967295)]
        ],
        length: [
            0,
            [Validators.required, Validators.min(0), Validators.max(255)]
        ],
        brand: [
            undefined,
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100)
            ]
        ],
        model: [
            undefined,
            [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100)
            ]
        ],
        active: [true, [Validators.required]],
        skipper: [false, [Validators.required]],
        license: [false, [Validators.required]]
    });

    constructor(
        private formBuilder: FormBuilder,
        private createBoatService: CreateBoatService
    ) {}

    /**
     * @method onSubmit is a very simple method checking if its valid or not, then depending on that runs corresponding functions.
     * Stuff like markAllAsTouched helps showing erros to the user pre-post request.
     * @author Marcus K.
     */
    public onSubmit(): void {
        this.status = '';
        console.log(this.createBoatForm);
        if (this.createBoatForm.valid === true) {
            this.onSuccess();
        } else {
            this.createBoatForm.markAllAsTouched();
            this.status = 'Er zitten fouten in de gegeven data!';
        }
    }

    /**
     * @method onSuccess knowing that it's valid on the front end, listens to what the back-end tells it.
     * If it's bad, it will tell the user. If it's good, it will tell the user and reset the form.
     * @author Marcus K.
     */
    private onSuccess(): void {
        const boatObject: newBoatData = this.createBoatObject();
        this.createBoatService.createNewBoat(boatObject).subscribe({
            error: (response: HttpErrorResponse): void => {
                this.status = response.error.message;
                console.log(response.error);
            },
            complete: (): void => {
                this.createBoatForm.reset({
                    price: 0,
                    capacity: 1,
                    year: new Date().getFullYear(),
                    length: 0,
                    active: true,
                    skipper: false,
                    license: false
                });
                this.status = 'success';
            }
        });
    }

    /**
     * @method createBoatObject simply takes the data filled in by the user and packages it up into one nice Object.
     * @returns newBoatData, which is the boat we want to send to the back-end to save.
     * @author Marcus K.
     */
    private createBoatObject(): newBoatData {
        return {
            name: this.createBoatForm.value.title,
            price: this.createBoatForm.value.price * 100,
            description: this.createBoatForm.value.description,
            capacity: this.createBoatForm.value.capacity,
            fabricationYear: this.createBoatForm.value.year,
            length: this.createBoatForm.value.length,
            brandname: this.createBoatForm.value.brand,
            model: this.createBoatForm.value.model,
            imageArray: this.imageArray,
            facilityArray: this.facilityArray,
            active: this.createBoatForm.value.active,
            skipperRequired: this.createBoatForm.value.skipper,
            licenseRequired: this.createBoatForm.value.license
        };
    }
}
