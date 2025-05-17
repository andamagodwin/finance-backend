import { Router } from "express";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import { handleCreateBank, handleGetBank, handleUpdateBank } from "../Controllers/BankController";
import { handleCreateCollection, handleGetCollection } from "../Controllers/CollectionController";

export default (router: Router) => {
  const notificationsPrefix = "/collections";
  router.get(
    `${notificationsPrefix}`,
    JWTAuthMiddleWare,
    handleGetCollection
  );
  router.post(
    `${notificationsPrefix}`,
    JWTAuthMiddleWare,
    handleCreateCollection
  );
  router.put(
    `${notificationsPrefix}`,
    JWTAuthMiddleWare,
    handleUpdateBank
  );
};
