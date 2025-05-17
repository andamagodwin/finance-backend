import { Router } from "express";
import UserRoutes from "./UserRoutes";
import AuthRoutes from "./AuthRoutes";
import NotificationRoutes from "./NotificationRoutes";
import OrderRoutes from "./OrderRoutes";
import CurrencyRoute from "./CurrencyRoute";
import BankRoutes from "./BankRoutes";
import PlaceRoutes from "./PlaceRoutes";
import CollectionRoutes from "./CollectionRoutes";
const router = Router();

// eslint-disable-next-line import/no-anonymous-default-export
export default (): Router => {
  UserRoutes(router);
  AuthRoutes(router);
  NotificationRoutes(router);
  OrderRoutes(router);
  BankRoutes(router);
  PlaceRoutes(router);
  CurrencyRoute(router);
  CollectionRoutes(router); 
  return router;
};
