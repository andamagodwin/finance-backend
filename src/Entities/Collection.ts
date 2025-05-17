import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Collection extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  amount: number;

  @Column()
  userId: number;

}

export const createCollection = async (
  amount: number, userId: number
) => {
  const collection = new Collection();
  collection.amount = amount;
  collection.userId = userId;
  await collection.save();
  return Collection;
};

export const getCollections = async () => {
  // get system notifications and user notifications
  const Collections = await Collection.find({
    order: {
      created_at: "DESC",
    },
  });

  return Collections;
};

export const updateCollection = async (
  id: number,
  amount: number
) => {
  const collection = await Collection.findOneBy({ id });

  if (!collection) {
    throw new Error("Collection not found");
  }
  collection.amount = amount;
  await collection.save();

  return collection;
};

