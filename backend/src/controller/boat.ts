import express from 'express';
import { Request, Response } from 'express';
import { Boat } from '../business/model/boat';
import { BoatService } from '../business/service/boat';
import { DetailedBoat } from '../business/model/boat-detailed';
import { ExpectedCreateBody } from '../data/interfaces/boat';

/**
 * Boat controller class handling boat-related operations.
 * @author Youri Janssen && Marcus K & Thijs van Rixoort
 */
export default class BoatController {
    /**
     * @author Youri Janssen
     * Constructor for BoatController.
     * @param {BoatService} boatService - An instance of the BoatService.
     * @designpattern Dependency Injection (DI)
     */
    constructor(private boatService: BoatService) {}

    /**
     * Searches for boats based on the provided name.
     * @param {express.Request} request - The request object.
     * @param {express.Response} response - The response object.
     * @returns {Promise<void>} A Promise that resolves once the operation is complete.
     * @author Youri Janssen & Thijs van Rixoort
     */
    public async searchBoats(
        request: express.Request,
        response: express.Response
    ): Promise<void> {
        const name = request.query.name!.toString();
        const limit: number = parseInt(request.query.limit!.toString());
        const offset: number = parseInt(request.query.offset!.toString());

        const boatSearchResult: Boat[] | string[] | 'server_error' =
            await this.boatService.searchBoats(name, limit, offset);

        if (boatSearchResult === 'server_error') {
            response.status(500).json({ error: 'A server error occurred' });
        } else if (
            Array.isArray(boatSearchResult) &&
            boatSearchResult.length === 0
        ) {
            response.status(200).json([]);
        } else if (
            Array.isArray(boatSearchResult) &&
            boatSearchResult[0] instanceof Boat
        ) {
            response.status(200).json(
                boatSearchResult.map((boat: Boat | string) => {
                    if (boat instanceof Boat) {
                        return boat.toJSON();
                    }
                })
            );
        } else if (
            Array.isArray(boatSearchResult) &&
            typeof boatSearchResult[0] === 'string'
        ) {
            response.status(400).json(boatSearchResult as string[]);
        }
    }

    /**
     * A simple GET Request function, aiming to get a copy of all the data from one (1) boat that a user can access by calling detailedBoatService.findBoat().
     * @param request is the incoming HTTP Request containing an ID.
     * @param response is the outgoing HTTP Response, containing all the data a boat detail page would need.
     * @author Marcus K.
     */
    public async getBoat(
        //Internal Note: A Request exists out of the following details: The ParameterDicitonary, The ResponseBody, The RequestBody and the RequestQuery.
        request: Request<object, DetailedBoat | string, null, { id: string }>,
        response: Response
    ): Promise<void> {
        const requestedBoat: number = parseInt(request.query.id);
        try {
            const foundBoat: DetailedBoat | null =
                await this.boatService.findBoat(requestedBoat);
            foundBoat
                ? response.status(200).json(foundBoat)
                : response
                      .status(400)
                      .json(
                          'The Requested Boat Cannot Be Found, Please Try Another Boat.'
                      );
        } catch (error) {
            console.log(error);
            response
                .status(500)
                .json('This Service Is Currenly Unavailable. ' + error);
        }
    }

    /**
     * @function createBoat is a simple POST Request dedicated to creating a brand new boat in the database.
     * @param request is the incoming HTTP Request containing all data related to the new boat.
     * @param response is the outgoing HTTP Response, reporting whether it succeeded or *why* it failed.
     * @author Marcus K.
     */
    public async createBoat(
        request: Request<object, string, ExpectedCreateBody>,
        response: Response
    ): Promise<void> {
        const requestBody: ExpectedCreateBody = request.body;

        try {
            const result: {
                created: boolean;
                message: string;
            } = await this.boatService.createBoat(requestBody);

            result.created
                ? response.status(201).json({ message: result.message })
                : response.status(400).json({ message: result.message });
        } catch (error: unknown) {
            console.log(error);
            response
                .status(500)
                .json('This Service Is Currenly Unavailable. ' + error);
        }
    }

    /**
     * @function getBoatOptions is a GET request for all the boat's facilities and models.
     * Essentially all existing data you're allowed to choose from when creating a boat.
     * @param response is the outgoing HTTP Response, returning the facility model arrays, nothing or an error.
     * @author Marcus K.
     */

    public async getBoatOptions(response: Response): Promise<void> {
        try {
            const results = await this.boatService.getBoatOptions();

            results.facilities.length === 0 && results.models.length === 0
                ? response.status(404).json(results)
                : response.status(200).json(results);
        } catch (error: unknown) {
            console.log(error);
            response
                .status(500)
                .json('This Service Is Currenly Unavailable. ' + error);
        }
    }
}
