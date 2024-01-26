import { BoatModel } from './models/boat';
import { BoatFacilityModel } from './models/boatfacility';
import BoatImageModel from './models/boatimage';
import BoatTypeModel from './models/boatmodel';
import { FacilityModel } from './models/facility';

/**
 * Class for seeding boats in the database.
 * @author Youri Janssen & Thijs van Rixoort
 */

export class SequelizeSeeder {
    /**
     * Seeds boats into the database.
     * @returns {Promise<void>} A Promise that resolves when the boats are seeded.
     * @author Youri Janssen & Thijs van Rixoort
     */
    public async seedBoats(): Promise<void> {
        await BoatModel.bulkCreate([
            {
                name: 'Buoy, Oh Buoy!',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: false,
                skipper_required: false
            },
            {
                name: 'Ship Happens',
                price_per_day_in_cents: 13000,
                capacity: 12,
                license_required: true,
                skipper_required: false
            },
            {
                name: 'Seas the Day',
                price_per_day_in_cents: 8000,
                capacity: 8,
                license_required: false,
                skipper_required: false
            },
            {
                name: 'Knot on Call',
                price_per_day_in_cents: 5500,
                capacity: 6,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Fishful Thinking',
                price_per_day_in_cents: 6000,
                capacity: 9,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Nauti by Nature',
                price_per_day_in_cents: 18000,
                capacity: 15,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Ship Faced',
                price_per_day_in_cents: 2500,
                capacity: 4,
                license_required: false,
                skipper_required: false
            },
            {
                name: 'Shipster',
                price_per_day_in_cents: 5000,
                capacity: 6,
                license_required: true,
                skipper_required: false
            },
            {
                name: 'Seas the Moment',
                price_per_day_in_cents: 25000,
                capacity: 12,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Shiver Me Timbers',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: false,
                skipper_required: false
            },
            {
                name: 'AquaHolic',
                price_per_day_in_cents: 13000,
                capacity: 10,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Hull of a Time',
                price_per_day_in_cents: 9000,
                capacity: 8,
                license_required: true,
                skipper_required: false
            },
            {
                name: 'Ship for Brains',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: false,
                skipper_required: false
            },
            {
                name: 'Piers Pressure',
                price_per_day_in_cents: 12500,
                capacity: 6,
                license_required: true,
                skipper_required: false
            },
            {
                name: 'Sailmates',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Nautical But Nice',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'The Salty Sailor',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Wave Hello',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Sea-esta',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Unbelayvable',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Anchors Aweigh',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Aye Aye Captain',
                price_per_day_in_cents: 4500,
                capacity: 6,
                license_required: true,
                skipper_required: false
            },
            {
                name: 'Knotical Nonsense',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: true,
                skipper_required: true
            },
            {
                name: 'Ship Shape',
                price_per_day_in_cents: 3000,
                capacity: 4,
                license_required: true,
                skipper_required: true
            }
        ]);
    }
    /**
     * @author Youri Janssen
     * Seeds facilities into the database.
     * @returns {Promise<void>} A Promise that resolves when the facilities are seeded.
     */
    public async seedFacility(): Promise<void> {
        await FacilityModel.bulkCreate([
            {
                facility: 'Toilet'
            },
            {
                facility: 'Douche'
            },
            {
                facility: 'Koelkast'
            }
        ]);
    }

    public async seedBoatModel(): Promise<void> {
        await BoatTypeModel.bulkCreate([
            {
                id: 1,
                model: 'Tender',
                brandname: 'Van Vossen'
            },
            {
                id: 2,
                model: 'Sloep',
                brandname: 'Den Driel'
            },
            {
                id: 3,
                model: 'Zeilboot',
                brandname: 'Schappen'
            }
        ]);
    }

    public async seedImages(): Promise<void> {
        await BoatImageModel.bulkCreate([
            {
                boat_id: 2,
                image_path:
                    'https://maximaboten.nl/wp-content/uploads/sites/7/2019/11/Maxima-Boten-Specialist-Zuidschor-Watersport-Maxima-600-34.jpg'
            },
            {
                boat_id: 2,
                image_path:
                    'https://maximaboten.nl/wp-content/uploads/sites/7/2019/11/Maxima-Boten-Specialist-Zuidschor-Watersport-Maxima-600-40.jpg'
            },
            {
                boat_id: 3,
                image_path: 'https://picsum.photos/1920/1080'
            },
            {
                boat_id: 4,
                image_path:
                    'https://i0.wp.com/www.varen.be/wp-content/uploads/2021/04/Aira-22_60.jpg?resize=800%2C533&ssl=1'
            },
            {
                boat_id: 4,
                image_path:
                    'https://i0.wp.com/www.varen.be/wp-content/uploads/2021/04/Aira-22_8.jpg?resize=800%2C533&ssl=1'
            },
            {
                boat_id: 4,
                image_path:
                    'https://airaboats.nl/wp-content/uploads/2021/02/Arthur_Smeets_Aira_2018_07_25_0232-LR-scaled-1800x0-c-default.jpg'
            },
            {
                boat_id: 4,
                image_path:
                    'https://airaboats.nl/wp-content/uploads/2021/02/Arthur_Smeets_Aira_2018_07_25_1009-LR-scaled.jpg.webp'
            },
            {
                boat_id: 4,
                image_path:
                    'https://hamburg-city-sailing.de/wp-content/uploads/2021/04/AIRA-22-by-City-Sailing-1-scaled.jpg'
            },
            {
                boat_id: 4,
                image_path: 'https://picsum.photos/1920/1081'
            },
            {
                boat_id: 4,
                image_path: 'https://picsum.photos/1920/1082'
            }
        ]);
    }

    /**
     * @author Youri Janssen & Thijs van Rixoort
     * Seeds boat-facility relationships into the database.
     * @returns {Promise<void>} A Promise that resolves when the boat-facility relationships are seeded.
     */
    public async seedBoatFacility(): Promise<void> {
        const boatFacilities = [
            { boat_id: 1, facility_id: 2 },
            { boat_id: 1, facility_id: 3 },
            { boat_id: 2, facility_id: 1 },
            { boat_id: 3, facility_id: 3 },
            { boat_id: 4, facility_id: 1 },
            { boat_id: 4, facility_id: 2 },
            { boat_id: 5, facility_id: 2 },
            { boat_id: 6, facility_id: 1 },
            { boat_id: 6, facility_id: 3 },
            { boat_id: 7, facility_id: 1 },
            { boat_id: 7, facility_id: 2 },
            { boat_id: 8, facility_id: 2 },
            { boat_id: 9, facility_id: 1 },
            { boat_id: 10, facility_id: 3 },
            { boat_id: 12, facility_id: 1 },
            { boat_id: 13, facility_id: 2 },
            { boat_id: 14, facility_id: 2 },
            { boat_id: 14, facility_id: 1 },
            { boat_id: 15, facility_id: 3 },
            { boat_id: 15, facility_id: 1 },
            { boat_id: 16, facility_id: 2 },
            { boat_id: 17, facility_id: 2 },
            { boat_id: 18, facility_id: 1 },
            { boat_id: 19, facility_id: 3 },
            { boat_id: 19, facility_id: 1 },
            { boat_id: 21, facility_id: 2 },
            { boat_id: 22, facility_id: 2 },
            { boat_id: 22, facility_id: 1 },
            { boat_id: 22, facility_id: 3 },
            { boat_id: 23, facility_id: 1 },
            { boat_id: 23, facility_id: 2 },
            { boat_id: 24, facility_id: 2 }
        ];

        await BoatFacilityModel.bulkCreate(boatFacilities);
    }
}
