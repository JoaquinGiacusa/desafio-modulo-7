import { User } from "./user";
import { Auth } from "./auth";
import { Pet } from "./pet";
import { Report } from "./report";

// ejemplo de módulo que importa a todos los modelos
// y los vincula

User.hasOne(Auth);
Auth.belongsTo(User);

User.hasMany(Pet);
Pet.belongsTo(User);

Pet.hasMany(Report);
Report.belongsTo(Pet);

export { User, Auth, Pet, Report };
