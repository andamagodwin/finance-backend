import { Response, Request } from "express";
import { createCollection, getCollections, updateCollection } from "../Entities/Collection";
import { customPayloadResponse } from "../Helpers/Helpers";
const handleResponse = (
    res: Response,
    success: boolean,
    data: any,
    status = 200
) => {
    return res.status(status).json(customPayloadResponse(success, data)).end();
};

export const handleGetCollection = async (req: Request, res: Response) => {
    try {
        const collections = await getCollections();
        handleResponse(res, true, collections); // ❌ No "return" here
    } catch (error) {
        console.error(error);
        handleResponse(res, false, "An error occurred", 500);
    }
};

export const handleCreateCollection = async (req: Request, res: Response) => {
    try {
        const { amount, userId } = req.body;

        if (!amount) {
            handleResponse(res, false, "Collection amount is required", 400);
            return;
        }
        const collection = await createCollection(amount,userId);
        handleResponse(res, true, collection);
    } catch (error) {
        console.error(error);
        handleResponse(res, false, "An error occurred", 500);
    }
};

export const handleUpdateCollection = async (req: Request, res: Response) => {
    try {
        const { id, name } = req.body;

        if (!id || !name) {
            handleResponse(res, false, "Collection ID and name are required", 400);
            return;
        }

        const Collection = await updateCollection(Number(id), name);
        handleResponse(res, true, Collection);
    } catch (error) {
        console.error(error);
        handleResponse(res, false, "An error occurred", 500);
    }
};

