import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
  In,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from "typeorm";
import { Bank } from "./Bank";
import { Currency } from "./Currency";

@Entity()
export class Place extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  name: string;

  @ManyToMany(() => Currency)
  @JoinTable()
  currencys: Currency[];

  @ManyToMany(() => Bank)
  @JoinTable()
  banks: Bank[];

  @ManyToMany(() => Place, place => place.banks)
  places: Place[];

}

export const createPlace = async (
  name: string,
  currencyIds: number[],
  bankIds: number[]
) => {
  const place = new Place();
  place.name = name;

  place.currencys = await Currency.findBy({ id: In(currencyIds) });
  place.banks = await Bank.findBy({ id: In(bankIds) });

  await place.save();
  return place;
};

export const getPlaces = async () => {
  const places = await Place.find({
    relations: ["banks", "currencys"],
    order: { created_at: "DESC" },
  });

  const formattedPlaces = places.map((place) => ({
    id: place.id,
    created_at: place.created_at,
    name: place.name,
    banks: place.banks.map((bank) => ({
      id: bank.id,
      name: bank.name,
    })),
    currencys: place.currencys.map((currency) => ({
      id: currency.id,
      name: currency.name,
    })),
  }));

  return formattedPlaces;
};



export const updatePlace = async (
  id: number,
  name: string,
  currencyIds: number[],
  bankIds: number[]
) => {
  const place = await Place.findOne({
    where: { id },
    relations: ["banks", "currencys"], // fetch current relations
  });

  if (!place) {
    throw new Error("Place not found; send the correct ID");
  }
  place.name = name;
  // Fetch updated related entities
  const banks = await Bank.findBy({ id: In(bankIds) });
  const currencys = await Currency.findBy({ id: In(currencyIds) });
  // Assign new relations
  place.banks = banks;
  place.currencys = currencys;
  await place.save();
  return place;
};

