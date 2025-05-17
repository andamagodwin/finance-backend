import { Response, Request } from "express";
import { createBank, getBanks, updateBank } from "../Entities/Bank";
import { customPayloadResponse } from "../Helpers/Helpers";
const handleResponse = (
    res: Response,
    success: boolean,
    data: any,
    status = 200
) => {
    return res.status(status).json(customPayloadResponse(success, data)).end();
};

export const handleGetBank = async (req: Request, res: Response) => {
    try {
        const banks = await getBanks();
        handleResponse(res, true, banks); // ❌ No "return" here
    } catch (error) {
        console.error(error);
        handleResponse(res, false, "An error occurred", 500);
    }
};

export const handleCreateBank = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            handleResponse(res, false, "Bank name is required", 400);
            return;
        }

        const bank = await createBank(name);
        handleResponse(res, true, bank);
    } catch (error) {
        console.error(error);
        handleResponse(res, false, "An error occurred", 500);
    }
};

export const handleUpdateBank = async (req: Request, res: Response) => {
    try {
        const { id, name } = req.body;

        if (!id || !name) {
            handleResponse(res, false, "Bank ID and name are required", 400);
            return;
        }

        const bank = await updateBank(Number(id), name);
        handleResponse(res, true, bank);
    } catch (error) {
        console.error(error);
        handleResponse(res, false, "An error occurred", 500);
    }
};

