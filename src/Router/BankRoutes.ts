import { Router } from "express";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { handleCreateBank, handleGetBank, handleUpdateBank } from "../Controllers/BankController";

export default (router: Router) => {
  const notificationsPrefix = "/banks";
  router.get(
    `${notificationsPrefix}`,
    JWTAuthMiddleWare,
    handleGetBank
  );
  router.post(
    `${notificationsPrefix}`,
    JWTAuthMiddleWare,
    handleCreateBank
  );
  router.put(
    `${notificationsPrefix}`,
    JWTAuthMiddleWare,
    handleUpdateBank
  );
};
