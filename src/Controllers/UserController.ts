import { Response, Request } from "express";
import {
  getUserByEmail,
  getuserById,
  generateSignupOtp,
  getAllMembers,
  createUser,
  getUsers,
  updateUserProfilePicture,
  getAllAdmins,
  blockUser,
  unBlockUser,
  makeMember,
  makeAdmin,
  makeUser,
} from "../Entities/User";
import {
  customPayloadResponse,
  sendMail,
  hashPassword,
  getAuthAccessToken,
  getAppUrl,
} from "../Helpers/Helpers";
import { createNotification } from "../Entities/Notification";

export const handleSignup = async (req: Request, res: Response) => {
  try {
    const { full_name, email, address, phone_number, password } = req.body;

    if (!full_name) {
      return res
        .json(customPayloadResponse(false, "Full Name Required"))
        .status(200)
        .end();
    }

    if (!email) {
      return res
        .json(customPayloadResponse(false, "Email Required"))
        .status(200)
        .end();
    }

    if (!password) {
      return res
        .json(customPayloadResponse(false, "Password Required"))
        .status(200)
        .end();
    }

    const user = await getUserByEmail(email);

    if (user) {
      return res
        .json(customPayloadResponse(false, "User Already Exists"))
        .status(200)
        .end();
    } else {
      const hashedPassword = await hashPassword(password, 10);
      if (!hashedPassword) {
        return res
          .json(customPayloadResponse(false, "An Error Occured"))
          .status(200)
          .end();
      }
      const newUser = await createUser(full_name, email, address, phone_number, hashedPassword);
      const otp = await generateSignupOtp(newUser.id);
      console.log(otp);
      await sendMail(
        email,
        "Email Verification",
        "OTP",
        {
          otp,
          name: full_name,
        },
        `Your OTP is ${otp}. This OTP will expire in 10 minutes.`
      );

      const accessToken = getAuthAccessToken(
        newUser,
        process.env.ACCESS_TOKEN_SECRET
      );

      const response = {
        token: accessToken,
        user: newUser,
      };

      return res.json(customPayloadResponse(true, response)).status(200).end();
    }
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};


export const handleResendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate request body
    if (!email) {
      return res.status(400).json(customPayloadResponse(false, "Email is required"));
    }

    // Fetch user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json(customPayloadResponse(false, "User not found"));
    }

    // Generate and send OTP
    const otp = await generateSignupOtp(user.id);
    await sendMail(
      email,
      "Email Verification",
      "OTP",
      {
        otp,
        name: user.full_name,
      },
      `Your OTP is ${otp}. This OTP will expire in 10 minutes.`
    );

    return res.status(200).json(customPayloadResponse(true, "OTP sent successfully"));
  } catch (error) {
    console.error("Error in handleResendOtp:", error);
    return res.status(500).json(customPayloadResponse(false, "An error occurred"));
  }
};


export const handleGetUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    return res.json(customPayloadResponse(true, users)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};


export const handleGetUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .json(customPayloadResponse(false, "Id Required"))
        .status(200)
        .end();
    }

    const user = await getuserById(parseInt(id));

    if (!user) {
      return res
        .json(customPayloadResponse(false, "User Not Found"))
        .status(200)
        .end();
    }

    return res.json(customPayloadResponse(true, user)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};

export const handleUpdateProfilePicture = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { profile_picture } = req.body;

    if (!id) {
      return res
        .json(customPayloadResponse(false, "Id Required"))
        .status(200)
        .end();
    }

    const user = await getuserById(parseInt(id));

    if (!user) {
      return res
        .json(customPayloadResponse(false, "User Not Found"))
        .status(200)
        .end();
    }

    const photo = req.file ? req.file.filename : profile_picture;

    if (!photo) {
      return res
        .json(customPayloadResponse(false, "Profile Picture Required"))
        .status(200)
        .end();
    }

    const updatedUser = await updateUserProfilePicture(
      parseInt(id),
      `${getAppUrl(req)}/useruploads/${photo}`
    );
    return res.json(customPayloadResponse(true, updatedUser)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};


export const handleGetAdminUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllAdmins();
    return res.json(customPayloadResponse(true, users)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};


export const handleBlockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .json(customPayloadResponse(false, "Id Required"))
        .status(200)
        .end();
    }
    const play = await blockUser(parseInt(id));
    return res.json(customPayloadResponse(true, play)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};

export const handleUnBlockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .json(customPayloadResponse(false, "Id Required"))
        .status(200)
        .end();
    }
    const play = await unBlockUser(parseInt(id));
    return res.json(customPayloadResponse(true, play)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};

export const handleMakeMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .json(customPayloadResponse(false, "Id Required"))
        .status(200)
        .end();
    }

    const play = await makeMember(parseInt(id));

    return res.json(customPayloadResponse(true, play)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};

export const handleMakeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .json(customPayloadResponse(false, "Id Required"))
        .status(200)
        .end();
    }
    const play = await makeUser(parseInt(id));
    return res.json(customPayloadResponse(true, play)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};

export const handleMakeAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .json(customPayloadResponse(false, "Id Required"))
        .status(200)
        .end();
    }

    const play = await makeAdmin(parseInt(id));

    return res.json(customPayloadResponse(true, play)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occured"))
      .status(200)
      .end();
  }
};

//get all members
export const handleGetMembers = async (req: Request, res: Response) => {
  try {
    const members = await getAllMembers();
    return res.json(customPayloadResponse(true, members)).status(200).end();
  } catch (error) {
    console.log(error);
    return res
      .json(customPayloadResponse(false, "An Error Occurred"))
      .status(200)
      .end();
  }
};

