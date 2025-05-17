
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  In,
} from "typeorm";
import { Notification } from "./Notification";
import { removeImage, roundOffNumbers } from "../Helpers/Helpers";
import { Order } from "./Order";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @Column({
    nullable: true,
    select: false,
  })
  reset_token: string;

  @Column({ nullable: true })
  signup_otp: string;
  // new 1
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone_number: string;


  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: false })
  is_member: boolean;

  @Column({ default: false })
  is_blocked: boolean;

  @Column({ nullable: true })
  profile_picture: string;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}



export const createUser = async (
  full_name: string,
  email: string,
  phone_number: string,
  address: string,
  password: string
) => {
  const user = new User();
  user.full_name = full_name;
  user.email = email;
  user.phone_number = phone_number,
    user.address = address,
    user.password = password;
  await user.save();
  return user;
};

export const getUserByEmail = async (email: string) => {
  return User.findOne({
    where: { email },
    select: [
      "id",
      "email",
      "password",    // 👈 Explicitly include the password
      "full_name",
      "is_member",
      "is_blocked",
      "reset_token",
      "signup_otp",
      "address",
      "phone_number",
      "is_admin",
      "profile_picture",
    ],
  });
};


export const getuserById = async (id: number) => {
  return User.findOne({
    where: { id },
  });
};


export const updateUserPassword = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("User not found");
  user.password = password;
  await user.save();
  return user;
};

export const updateUserResetToken = async (id: number, reset_token: string) => {
  const user = await User.findOne({ where: { id } });
  if (!user) throw new Error("User not found");
  user.reset_token = reset_token;
  await user.save();
  return user;
};

export const generateSignupOtp = async (id: number) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await User.findOne({ where: { id } });
  if (!user) throw new Error("User not found");
  user.signup_otp = otp;
  await user.save();
  return otp;
};

export const generateResetToken = async (id: number) => {
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await User.findOne({ where: { id } });
  if (!user) return null;
  user.reset_token = token;
  await user.save();
  return token;
};

export const getUserPassword = async (email: string) => {
  return User.findOne({
    select: ["id", "password"],
    where: { email },
  });
};

export const setResetToken = async (email: string, token: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;
  user.reset_token = token;
  await user.save();
  return user;
};

export const getRessetToken = async (email: string) => {
  return User.findOne({
    select: ["reset_token"],
    where: { email },
  });
};

export const makeUser = async (id: number) => {
  const user = await User.findOne({ where: { id } });
  if (!user) return null;
  user.is_member = false;
  user.is_admin = false;
  await user.save();
  return user;
};

export const makeMember = async (id: number) => {
  const user = await User.findOne({ where: { id } });
  if (!user) return null;
  user.is_member = true;
  await user.save();
  return user;
};

export const makeAdmin = async (id: number) => {
  const user = await User.findOne({ where: { id } });
  if (!user) return null;
  user.is_admin = true;
  await user.save();
  return user;
};

//get all members
export const getAllMembers = async () => {
  const user = await User.find({ where: { is_member: true } });
  if (!user) return null;
  return user;
};

export const getAllAdmins = async () => {
  const user = await User.find({ where: { is_admin: true, is_member: false } });
  if (!user) return null;
  return user;
};

export const getUsers = async () => {
  const users = await User.find({
    where: {
      is_admin: false,
      is_member: false
    },
    order: {
      id: "DESC"
    }
  });
  return users;
};


export const updateUserProfilePicture = async (
  id: number,
  profile_picture: string
) => {
  const user = await User.findOne({ where: { id } });
  if (!user) throw new Error("User not found");
  user.profile_picture = profile_picture;
  await user.save();
  // console.log(user);
  return user;
};

export const blockUser = async (id: number) => {
  const user = await getuserById(id);
  if (!user) throw new Error("User not found");
  user.is_blocked = false;
  await user.save();
  return true;
};

export const unBlockUser = async (id: number) => {
  const user = await getuserById(id);
  if (!user) throw new Error("User not found");
  user.is_blocked = true;
  await user.save();
  return true;
};

