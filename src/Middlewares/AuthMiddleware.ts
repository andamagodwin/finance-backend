import { Request, Response, NextFunction, RequestHandler } from "express";
import { customPayloadResponse, verifyAuthAccessToken } from "../Helpers/Helpers";

interface AuthenticatedRequest extends Request {
  user: any; // Ideally, replace `any` with a proper User type
}

export const JWTAuthMiddleWare: any = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(customPayloadResponse(false, "Unauthorized: No Token Provided"));
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAuthAccessToken(token, process.env.ACCESS_TOKEN_SECRET!);
    if (!decoded) {
      return res.status(401).json(customPayloadResponse(false, "Invalid Token"));
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(customPayloadResponse(false, "Invalid Token"));
  }
};
