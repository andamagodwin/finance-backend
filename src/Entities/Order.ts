import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  IsNull,
  Not,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { User, getuserById } from "./User";
import { dateFormatter, roundOffNumbers } from "../Helpers/Helpers";

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "userId" })
  user!: User; // This will hold the full User object

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: "memberId" })
  memberId!: User; // This will hold the full User object

  @Column()
  amount: number;

  @Column()
  fromCurrency: number;

  @Column()
  receiverPlace: string;

  @Column()
  receiverCurrency: number;

  @Column()
  senderName: string;

  @Column()
  senderPhone: string;

  @Column()
  senderAddress: string;

  @Column()
  relationship: string;

  @Column()
  receiverName: string;

  @Column()
  receiverPhone: string;

  @Column()
  receiverAddress: string;

  @Column()
  bank: string;

  @Column()
  status: OrderStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

export interface OrderItem {
  productId: number;
  qty: number;
}

export type OrderStatus = "pending" | "approved" | "cancelled" | "completed";

export const createOrder = async (
  userId: number,
  amount: number,
  memberId: number,
  fromCurrency: number,
  receiverPlace: string,
  receiverCurrency: number,
  senderName: string,
  senderPhone: string,
  senderAddress: string,
  relationship: string,
  receiverName: string,
  receiverPhone: string,
  receiverAddress: string,
  bank: string
) => {
  const orderObj = new Order();
  orderObj.user = { id: userId } as User;
  orderObj.amount = amount;
  orderObj.fromCurrency = fromCurrency;
  orderObj.receiverPlace = receiverPlace;
  orderObj.receiverCurrency = receiverCurrency;
  orderObj.senderName = senderName;
  orderObj.senderPhone = senderPhone;
  orderObj.senderAddress = senderAddress;
  orderObj.relationship = relationship;
  orderObj.receiverName = receiverName;
  orderObj.receiverPhone = receiverPhone;
  orderObj.receiverAddress = receiverAddress;
  orderObj.bank = bank;
  orderObj.status = "pending";
  await orderObj.save();
  return orderObj;
};

export const getOrderById = async (id: number) => {
  return Order.findOne({
    where: { id },
  });
};

export const getOrdersByUserId = async (userId: number) => {
  return Order.find({
    where: { user: { id: userId } },
  });
};

export const getOrders = async (): Promise<Order[]> => {
  return await Order.find({
    order: {
      id: "DESC",
    },
  });
};

export const getUserOrders = async (id: number): Promise<Order[]> => {
  return await Order.find({
    order: {
      id: "DESC",
    },
    where: [{ user: { id } }, { memberId: { id } }],
  });
};

export const deleteOrder = async (id: number) => {
  const orderObj = await getOrderById(id);
  if (!orderObj)
    throw new Error(
      "order not Found make sure you have selected the right one"
    );
  await orderObj.remove();
  return true;
};

export const changeOrderStatus = async (order: Order, status: OrderStatus) => {
  // Update status and save
  order.status = status;
  await order.save();

  return order;
};

export const asignMember = async (id: number, memberId: number) => {
  // Find the order by ID
  const orderObj = await getOrderById(id);
  if (!orderObj) throw new Error("Order not found");

  // Find the agent user by ID
  const member = await getuserById(memberId);
  if (!member) throw new Error("Agent not found");

  // Update the agent relationship
  orderObj.memberId = member;
  await orderObj.save();
  return orderObj;
};

export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return ["pending", "approved", "cancelled", "completed"].includes(status);
};
