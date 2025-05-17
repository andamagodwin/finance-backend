import { Router } from "express";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { handleCreatePlace, handleGetPlace, handleUpdatePlace } from "../Controllers/PlaceController";

export default (router: Router) => {
  const notificationsPrefix = "/places";
  router.get(
    `${notificationsPrefix}`,
    JWTAuthMiddleWare,
    handleGetPlace
  );
  router.post(
    `${notificationsPrefix}`,
    JWTAuthMiddleWare,
    handleCreatePlace
  );
  router.put(
    `${notificationsPrefix}`,
    JWTAuthMiddleWare,
    handleUpdatePlace
  );
};
