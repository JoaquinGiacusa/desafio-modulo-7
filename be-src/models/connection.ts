import { Sequelize } from "sequelize";

//env-var
import * as path from "path";
import * as dotenv from "dotenv";
const rutaRelativa = path.resolve(__dirname, "../.env");
dotenv.config({ path: rutaRelativa });
//

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "cjorkrwnyucroj",
  password: process.env.POSTGRES_PSW,
  database: "del7mpv87orti9",
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
