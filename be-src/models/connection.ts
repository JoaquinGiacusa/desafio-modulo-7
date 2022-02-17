import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "cjorkrwnyucroj",
  password: process.env.POSTGRES_PSW,
  database: "d75cjhbcu07so7",
  port: 5432,
  host: "ec2-44-196-242-155.compute-1.amazonaws.com",
  ssl: true,
  // esto es necesario para que corra correctamente
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
