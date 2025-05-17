import { Router } from "express";
const { handleLogin, handleUpdatePassword, getAuthenticatedUser, passwordResetRequest, getSingleUser } = require("../Controllers/AuthenticationController");
// import {
//   handleLogin,
//   handleUpdatePassword,
//   getAuthenticatedUser,
//   passwordResetRequest,
//   getSingleUser
// } from "../Controllers/AuthenticationController";
import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";

export default (router: Router) => {
  const userPrefix = "/auth";
  router.post(`${userPrefix}/login`, handleLogin);
  router.post(`${userPrefix}/get-single-user`, getSingleUser);
  router.put(`${userPrefix}/update-password`, handleUpdatePassword);
  router.get(`${userPrefix}/me`, JWTAuthMiddleWare, getAuthenticatedUser);
  router.post(`${userPrefix}/request-code`, passwordResetRequest);
};
