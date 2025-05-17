import { Router } from "express";
const {
  handleCreateOrder,
  handleChangeOrderStatus,
  handleGetOrders,
  handleDeleteOrder,
  handleGetUserOrders,
  handleAsignAgent,
  handleAsignDelivery,
  handleAsignPromoter,
  handleGetOrdersWithProfit,
  handleGetOrdersWithoutProfit,
  handleUserOrderStats,
  handleInvestorProfit,
} = require("../Controllers/OrderController");

import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
export default (router: Router) => {
  const OrderPrefix = "/order";
  router.get(`${OrderPrefix}/all`, JWTAuthMiddleWare, handleGetOrders);
  router.post(
    `${OrderPrefix}/user-orders`,
    JWTAuthMiddleWare,
    handleGetUserOrders
  );
  router.post(`${OrderPrefix}/create`, JWTAuthMiddleWare, handleCreateOrder);
  router.put(
    `${OrderPrefix}/update`,
    JWTAuthMiddleWare,
    handleChangeOrderStatus
  );
  router.delete(`${OrderPrefix}/delete`, JWTAuthMiddleWare, handleDeleteOrder);

};
