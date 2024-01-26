import { ExpectedCreateBody } from '../../src/data/interfaces/boat';

/* BoatHelper exists to cut down on the amount to write of identical tests with different data. These gets tested for each. */
export class BoatHelper {
    /**
     * @method validCreateData contains objects that should all PASS tests dedicated to creating a boat.
     * @returns an array containing what kind of test we're doing here and the data to be tested upon.
     * @author Marcus K.
     */
    public validCreateData(): {
        testType: string;
        data: ExpectedCreateBody;
    }[] {
        return [
            {
                testType: 'where all datafields are populated',
                data: {
                    id: 200,
                    name: 'Test Boot',
                    description: 'Deze boot heeft nog geen beschrijving!',
                    price: 1250,
                    capacity: 9,
                    licenseRequired: true,
                    skipperRequired: true,
                    /* This is one thing that's not properly checked when querying and that I need to fix. The modelId */
                    modelId: 200,
                    fabricationYear: 2006,
                    length: 13,
                    active: true,
                    model: 'Nieuwe Model',
                    brandName: 'Nieuwe Merk',
                    facilityArray: ['Nieuw1', 'Nieuw2', 'Nieuw3', 'Nieuw4'],
                    imageArray: [
                        'https://picsum.photos/1080/1920',
                        'https://picsum.photos/1080/1921',
                        'https://picsum.photos/1080/1922'
                    ]
                }
            },
            {
                testType:
                    'where only the minimum amount of datadatafields is populated',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false
                }
            },
            {
                testType:
                    'where values are set to minimum edgecases (except modelId, this is covered in ALL datafields)',
                data: {
                    name: 'a',
                    description: 'a',
                    price: 0,
                    capacity: 0,
                    licenseRequired: false,
                    skipperRequired: false,
                    fabricationYear: 1,
                    length: 1,
                    active: false,
                    model: 'a',
                    brandName: 'a',
                    facilityArray: ['a'],
                    imageArray: ['https:a.a']
                }
            },

            {
                testType: 'where values are set to maximum edgecases',
                data: {
                    id: 4294967295,
                    name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                    description:
                        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                    price: 16777215,
                    capacity: 255,
                    licenseRequired: true,
                    skipperRequired: true,
                    fabricationYear: 2006,
                    length: 13,
                    active: true,
                    model: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                    brandName:
                        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                    facilityArray: [
                        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                    ],
                    imageArray: [
                        'https://picsuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuum.photos/1080/1920'
                    ]
                }
            }
        ];
    }

    /**
     * @method invalidCreateData contains objects that should all FAIL tests dedicated to creating a boat.
     * @returns an array containing what kind of test we're doing here and the data to be tested upon.
     * @author Marcus K.
     */
    public invalidCreateData(): {
        testType: string;
        failureReason: string;
        data: ExpectedCreateBody;
    }[] {
        return [
            {
                testType: 'where the id exceeds its minimum edgecase',
                failureReason:
                    'Error: Id moet een waarde zijn tussen 1 en 4294967295',
                data: {
                    id: -1,
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false
                }
            },
            {
                testType: 'where the id exceeds its maximum edgecase',
                failureReason:
                    'Error: Id moet een waarde zijn tussen 1 en 4294967295',
                data: {
                    id: 4294967296,
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false
                }
            },
            {
                testType: 'where the description exceeds its maximum edgecase',
                failureReason:
                    'Error: Descriptie moet tussen de 0 tot 255 letters lang zijn',
                data: {
                    name: 'Test Boot',
                    description:
                        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false
                }
            },
            {
                testType: 'where the price exceeds its minimum edgecase',
                failureReason:
                    'Error: De prijs moet een waarde zijn tussen 0 en 16777215',
                data: {
                    name: 'Test Boot',
                    price: -1,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false
                }
            },
            {
                testType: 'where the price exceeds its maximum edgecase',
                failureReason:
                    'Error: De prijs moet een waarde zijn tussen 0 en 16777215',
                data: {
                    name: 'Test Boot',
                    price: 16777216,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false
                }
            },
            {
                testType: 'where the capacity exceeds its minimum edgecase',
                failureReason:
                    'Error: De capaciteit moet een waarde zijn tussen 0 and 255',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: -1,
                    licenseRequired: false,
                    skipperRequired: false
                }
            },
            {
                testType: 'where the capacity exceeds its maximum edgecase',
                failureReason:
                    'Error: De capaciteit moet een waarde zijn tussen 0 and 255',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 256,
                    licenseRequired: false,
                    skipperRequired: false
                }
            },
            {
                testType: 'where the modelId exceeds its minimum edgecase',
                failureReason:
                    'Error: ModelId moet een waarde zijn tussen 1 en 4294967295',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    modelId: 0
                }
            },
            {
                testType: 'where the modelId exceeds its maximum edgecase',
                failureReason:
                    'Error: ModelId moet een waarde zijn tussen 1 en 4294967295',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    modelId: 4294967296
                }
            },
            {
                testType:
                    'where the fabricationYear exceeds its minimum edgecase',
                failureReason:
                    'Error: Het bouwjaar moet een waarde zijn tussen 0 en 4294967295',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    fabricationYear: -1
                }
            },
            {
                testType:
                    'where the fabricationYear exceeds its maximum edgecase',
                failureReason:
                    'Error: Het bouwjaar moet een waarde zijn tussen 0 en 4294967295',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    fabricationYear: 4294967296
                }
            },
            {
                testType: 'where the length exceeds its minimum edgecase',
                failureReason:
                    'Error: De lengte moet een waarde zijn tussen 0 en 255',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    length: -1
                }
            },
            {
                testType: 'where the length exceeds its maximum edgecase',
                failureReason:
                    'Error: De lengte moet een waarde zijn tussen 0 en 255',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    length: 256
                }
            },
            {
                testType: 'where the model exceeds its minimum edgecase',
                failureReason:
                    'Error: De modelnaam moet tussen de 1 tot 100 leeters lang zijn',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    model: ''
                }
            },
            {
                testType: 'where the model exceeds its maximum edgecase',
                failureReason:
                    'Error: De modelnaam moet tussen de 1 tot 100 leeters lang zijn',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    model: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                }
            },
            {
                testType: 'where the brandName exceeds its minimum edgecase',
                failureReason:
                    'Error: De merknaam moet tussen de 1 tot 100 letters lang zijn',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    brandName: ''
                }
            },
            {
                testType: 'where the brandName exceeds its maximum edgecase',
                failureReason:
                    'Error: De merknaam moet tussen de 1 tot 100 letters lang zijn',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    brandName:
                        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                }
            },
            {
                testType:
                    'where the facilityArray exceeds its minimum edgecase',
                failureReason:
                    'Error: Een faciliteit moet tussen de 1 tot 100 letters lang zijn',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    facilityArray: ['']
                }
            },
            {
                testType:
                    'where the facilityArray exceeds its maximum edgecase',
                failureReason:
                    'Error: Een faciliteit moet tussen de 1 tot 100 letters lang zijn',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    facilityArray: [
                        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
                    ]
                }
            },
            {
                testType:
                    'where the imageArray image is not part of the WHATWG URL Standard',
                failureReason:
                    'Error: URL(s) moeten de WHATWG URL Standaard aanhouden',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    imageArray: ['ExampleString']
                }
            },
            {
                testType: 'where the imageArray exceeds its maximum edgecase',
                failureReason:
                    'Error: Een URL moet tussen de 1 tot 255 letters lang zijn. Huidige lengte: (256)',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    imageArray: [
                        'https://picsuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuum.photos/1080/1920'
                    ]
                }
            },
            {
                testType:
                    'where an url in the imageArray with a valid length of unicode characters does not get accepted if it exceeds the max length in ASCII',
                failureReason:
                    'Error: Een URL moet tussen de 1 tot 255 letters lang zijn. Huidige lengte: (256)',
                data: {
                    name: 'Test Boot',
                    price: 1250,
                    capacity: 9,
                    active: true,
                    licenseRequired: false,
                    skipperRequired: false,
                    imageArray: [
                        'https://theurlisonly104characterslong.butconvertingunicodetoasciimakesit256charslong/測試経筑購面可助能食願需明軟郎刻時作言'
                    ]
                }
            }
        ];
    }
}
