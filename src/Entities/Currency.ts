
import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToMany, OneToMany } from "typeorm";
import { Place } from "./Place";
@Entity()
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column("float")
  rate_per_dollar: number;

  @Column()
  code: string;

  @Column()
  symbol: string;

  @ManyToMany(() => Place, place => place.currencys)
  places: Place[];

}

export const addCurrency = async (name: string, rate_per_dollar: number,code:string,symbol:string) => {
  const currency = Currency.create({ name, rate_per_dollar,code,symbol });
  currency.save();
  return currency;
};

export const getCurrencyById = async (id: number) => {
  return await Currency.findOne({ where: { id } });
};

export const updateCurrency = async (
  id: number,
  name: string,
  rate_per_dollar: number,
  code: string,
  symbol:string,
) => {
  const currency = await getCurrencyById(id);

  if (!currency) {
    throw new Error("currency not Found");
  }
  currency.name = name;
  currency.rate_per_dollar = rate_per_dollar;
  currency.code = code;
  currency.symbol = symbol;

  currency.save();
  return currency;
};

export const deleteCurrency = async (id: number) => {
  const currency = await getCurrencyById(id);

  if (!currency) {
    throw new Error("currency not Found");
  }
  currency.remove();
  return "Deleted";
};

export const getCurrencies = async () => {
  return await Currency.find();
};
