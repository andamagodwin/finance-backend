import { Response, Request } from "express";
import {
  createNotification,
  createSystemNotification,
  getNotifications,
  markNotificationAsRead,
} from "../Entities/Notification";
import { customPayloadResponse } from "../Helpers/Helpers";

export const handleGetNotifications = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    // const user = req.user; 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
    // git remote set-url origin https://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@github.com/omenyrobert/flflbackend.git

    const { userId } = req.params;
    // const call = await getCall(parseInt(id));
    const notifications = await getNotifications(parseInt(userId));
    return res
      .json(customPayloadResponse(true, notifications))
      .status(200)
      .end();
  } catch (error: any) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, error.message))
      .status(500)
      .end();
  }
};

export const handleMarkNotificationAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await markNotificationAsRead(parseInt(id));
    return res
      .json(customPayloadResponse(true, "Notification Marked as Read"))
      .status(200)
      .end();
  } catch (error: any) {
    return res
      .json(customPayloadResponse(false, error.message))
      .status(500)
      .end();
  }
};

export const handleCreateNotification = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;
    await createSystemNotification(title, description);
    return res
      .json(customPayloadResponse(true, "Notification Created"))
      .status(200)
      .end();
  } catch (error: any) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, error.message))
      .status(500)
      .end();
  }
};
