import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
} from "typeorm";

import { Place } from "./Place";

@Entity()
export class Bank extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  name: string;

  @ManyToMany(() => Place, (place) => place.banks)
  places: Place[];

}

export const createBank = async (
  name: string
) => {
  const bank = new Bank();
  bank.name = name;
  await bank.save();
  return bank;
};

export const getBanks = async () => {
  // get system notifications and user notifications
  const banks = await Bank.find({
    order: {
      created_at: "DESC",
    },
  });

  return banks;
};

export const updateBank = async (
  id: number,
  name: string
) => {
  const bank = await Bank.findOneBy({ id });

  if (!bank) {
    throw new Error("Bank not found");
  }

  bank.name = name;
  await bank.save();

  return bank;
};

