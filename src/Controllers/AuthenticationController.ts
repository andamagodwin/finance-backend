import { Response, Request } from "express";
import {
  User,
  getUserByEmail,
  getuserById,
  getUserPassword,
  updateUserPassword,
  setResetToken,
  getRessetToken,
} from "../Entities/User";

import {
  validatePassword,
  customPayloadResponse,
  getAuthAccessToken,
  decodeToken,
  setTokenExpiryToZero,
  invalidateToken,
  randomStringGenerator,
  sendingMail,
  hashPassword,
  roundOffNumbers,
} from "../Helpers/Helpers";
require("dotenv").config();

export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      const missingField = !email ? "Email" : "Password";
      return res
        .status(400)
        .json(customPayloadResponse(false, `${missingField} Required`));
    }

    // Fetch user with password in one call to the database
    const user = await getUserByEmail(email);
    console.log(user);

    if (!user) {
      return res
        .status(401)
        .json(customPayloadResponse(false, "Incorrect Email or Password"));
    }

    if (!user.password) {
    return res
      .status(500)
      .json(customPayloadResponse(false, "User password not found in the database"));
    }


    // Validate password
    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(customPayloadResponse(false, "Incorrect Email or Password"));
    }

    // Check if the user is blocked
    if (user.is_blocked) {
      return res
        .status(403)
        .json(customPayloadResponse(false, "Your account has been blocked. Contact the admin."));
    }

    // Generate token
    const token = getAuthAccessToken(user, process.env.ACCESS_TOKEN_SECRET);

    // Respond with user info and token
    const response = {
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        is_member: user.is_member,
        is_admin: user.is_admin,
      },
    };

    return res.status(200).json(customPayloadResponse(true, response));
  } catch (error) {
    console.error("Login error", error);
    return res
      .status(500)
      .json(customPayloadResponse(false, "Internal Server Error"));
  }
};


export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .json(customPayloadResponse(false, "User Id Required"))
        .status(200)
        .end();
    }

    const findUserById = await getuserById(userId);

    if (findUserById) {
      const response = findUserById;

      return res.json(customPayloadResponse(true, response)).status(200).end();
    } else {
      return res
        .json(customPayloadResponse(false, "User not found"))
        .status(200)
        .end();
    }
  } catch (error) {
    console.log("single user error", error);
  }
};


export const handleLogout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = decodeToken(token);

    const modifiedJWTLoad = setTokenExpiryToZero(decoded);

    const newToken = invalidateToken(
      modifiedJWTLoad,
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.json(customPayloadResponse(true, { logoutToken: newToken }));
  } catch (error) {
    console.log(error);
  }
};

export const getAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const authenticatedUser = await getuserById(req.user?.id);

    return res.json(customPayloadResponse(true, authenticatedUser));
  } catch (error) {
    console.log(error);
  }
};

export const passwordResetRequest = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const code = randomStringGenerator(6);

    if (!email) {
      return res
        .json(customPayloadResponse(false, "Email Required"))
        .status(200)
        .end();
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res
        .json(customPayloadResponse(false, "Email Does Not Exist"))
        .status(200)
        .end();
    } else {
      await setResetToken(email, code);
      console.log(code);

      const mailOptions = {
        to: email,
        subject: "Password Reset Code",
        template: "Email",
        context: {
          body:
            "Hey " + user.full_name + ", Below is the code for password reset.",
          data: code,
        },
      };
      sendingMail(mailOptions);
      return res
        .json(customPayloadResponse(true, { email: email, token: code }))
        .status(200)
        .end();
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdatePassword = async (req: Request, res: Response) => {
  try {
    console.log("Update Password");
    const { email, token, password } = req.body;

    if (!token) {
      return res
        .json(customPayloadResponse(false, "Token is required"))
        .status(200)
        .end();
    }
    if (!password) {
      return res
        .json(customPayloadResponse(false, "Password is required"))
        .status(200)
        .end();
    }

    const userProfile = await getUserByEmail(email);

    if (!userProfile) {
      return res
        .json(customPayloadResponse(false, "User not found"))
        .status(200)
        .end();
    }

    const userToken = await getRessetToken(email);

    if (userToken?.reset_token !== token) {
      return res
        .json(customPayloadResponse(false, "Invalid Token"))
        .status(200)
        .end();
    }

    const hashedPassword = await hashPassword(password, 10);
    if (hashPassword === undefined || hashPassword === null) {
      return res
        .json(customPayloadResponse(false, "User not found"))
        .status(200)
        .end();
    }
    // @ts-ignore
    const user = await updateUserPassword(email, hashedPassword);
    console.log("Password Updated");

    return res.json(customPayloadResponse(true, user)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "Error occured"))
      .status(200)
      .end();
  }
};
