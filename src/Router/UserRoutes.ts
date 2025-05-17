import { Router } from "express";
const {
  handleSignup,
  handleGetUser,
  handleGetUsers,
  handleResendOtp,
  handleGetMembers,
  handleGetAdminUsers,
  handleMakeMember,
  handleMakeAdmin,
  handleMakeUser
} = require("../Controllers/UserController");

import { JWTAuthMiddleWare } from "../Middlewares/AuthMiddleware";
import multer from "multer";
const storage = multer.diskStorage({
  destination: "useruploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default (router: Router) => {
  const userPrefix = "/users";
  router.post(`${userPrefix}/signup`, handleSignup);
  router.get(`${userPrefix}/user`, JWTAuthMiddleWare, handleGetUser);
  router.post(`${userPrefix}/make-member`, JWTAuthMiddleWare, handleMakeMember);
  router.post(`${userPrefix}/make-user`, JWTAuthMiddleWare, handleMakeUser);
  router.post(`${userPrefix}/make-admin`, JWTAuthMiddleWare, handleMakeAdmin);
  router.get(`${userPrefix}/users`, JWTAuthMiddleWare, handleGetUsers);
  router.get(`${userPrefix}/admins`, JWTAuthMiddleWare, handleGetAdminUsers);
  router.get(`${userPrefix}/members`, JWTAuthMiddleWare, handleGetMembers);
  router.post(`${userPrefix}/resend-otp`, handleResendOtp);
  router.get(
    `${userPrefix}/get-members`,
    JWTAuthMiddleWare,
    handleGetMembers
  )
};
