import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    eager: true,
    nullable: true,
  })
  user: User;

  @Column()
  type: "system" | "user";

  @Column({ default: false })
  is_read: boolean;
}

export const createNotification = async (
  title: string,
  description: string,
  type: "system" | "user",
  userid: number | null = null
) => {
  const notification = new Notification();
  notification.title = title;
  notification.description = description;
  notification.type = type;
  if (userid) {
    const user = await User.findOne({ where: { id: userid } });
    if (!user) throw new Error("User not found");
    notification.user = user;
  }
  await notification.save();
  return notification;
};

export const getNotifications = async (userid: number) => {
  const user = await User.findOne({ where: { id: userid } });
  if (!user) throw new Error("User not found");
  // get system notifications and user notifications
  const notifications = await Notification.find({
    where: {
      // user is user or null
      user: user,
      is_read: false,
    },
    order: {
      created_at: "DESC",
    },
  });

  return notifications;
};

export const markNotificationAsRead = async (id: number) => {
  const notification = await Notification.findOne({
    where: { id },
  });
  if (!notification) throw new Error("Notification not found");
  notification.is_read = true;
  await notification.save();
  return notification;
};

export const createSystemNotification = async (
  title: string,
  description: string
) => {
  const users = await User.find();
  for (const user of users) {
    await createNotification(title, description, "system", user.id);
  }
};
