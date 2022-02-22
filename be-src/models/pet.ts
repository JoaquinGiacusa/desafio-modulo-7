import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connection";

export class Pet extends Model {}
Pet.init(
  {
    name: DataTypes.STRING,
    imageURL: DataTypes.STRING,
    last_location_lat: DataTypes.STRING,
    last_location_lgn: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
  },
  { sequelize, modelName: "pet" }
);
