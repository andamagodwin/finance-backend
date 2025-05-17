import { Router } from "express";
const {
  handleCreateNotification,
  handleGetNotifications,
  handleMarkNotificationAsRead,
} = require("../Controllers/NotificationController");
// import {
//   handleCreateNotification,
//   handleGetNotifications,
//   handleMarkNotificationAsRead,
// } from "../Controllers/NotificationController";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";

export default (router: Router) => {
  const notificationsPrefix = "/notifications";

  router.get(
    `${notificationsPrefix}/:userId`,
    JWTAuthMiddleWare,
    handleGetNotifications
  );

  router.post(
    `${notificationsPrefix}`,
    JWTAuthMiddleWare,
    handleCreateNotification
  );

  router.put(
    `${notificationsPrefix}/:id/mark-as-read`,
    JWTAuthMiddleWare,
    handleMarkNotificationAsRead
  );
};
