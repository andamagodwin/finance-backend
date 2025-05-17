import { Response, Request } from "express";
import { createPlace, getPlaces, updatePlace } from "../Entities/Place";
import { customPayloadResponse } from "../Helpers/Helpers";
const handleResponse = (
    res: Response,
    success: boolean,
    data: any,
    status = 200
) => {
    return res.status(status).json(customPayloadResponse(success, data)).end();
};

export const handleGetPlace = async (req: Request, res: Response) => {
    try {
        const Places = await getPlaces();
        handleResponse(res, true, Places); // ❌ No "return" here
    } catch (error) {
        console.error(error);
        handleResponse(res, false, "An error occurred", 500);
    }
};

export const handleCreatePlace = async (req: Request, res: Response) => {
    try {
        const { name, banks, currencys } = req.body;
        if (!name) {
            handleResponse(res, false, "Place name is required", 400);
            return;
        }
        const Place = await createPlace(name, currencys, banks);
        handleResponse(res, true, Place);
    } catch (error) {
        console.error(error);
        handleResponse(res, false, "An error occurred", 500);
    }
};

export const handleUpdatePlace = async (req: Request, res: Response) => {
    try {
        const { id, name, currencys, banks } = req.body;
        if (!id || !name) {
            handleResponse(res, false, "Place ID and name are required", 400);
            return;
        }
        const Place = await updatePlace(Number(id), name, currencys, banks);
        handleResponse(res, true, Place);
    } catch (error) {
        console.error(error);
        handleResponse(res, false, "An error occurred", 500);
    }
};

