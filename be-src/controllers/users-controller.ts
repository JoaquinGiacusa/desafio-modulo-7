import { User, Auth, Pet, Report } from "../models";
import * as crypto from "crypto";
import { index } from "../lib/algolia";
import * as jwt from "jsonwebtoken";

const SECRET = "dfgjk3lq45hñfjk324";
const secret = process.env.JWT_SECRET;

//import { cloudinary } from "../lib/cloudinary";

function getSHA256ofString(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function createUser(
  fullName: string,
  email: string,
  password: string
) {
  if (!email || !fullName) {
    throw "email es necesario";
  } else {
  }
  const [user, created] = await User.findOrCreate({
    where: { email: email },
    defaults: {
      fullName,
      email,
    },
  });
  const [auth, authCreated] = await Auth.findOrCreate({
    where: { userId: user.get("id") },
    defaults: {
      email,
      password: getSHA256ofString(password),
      userId: user.get("id"),
    },
  });
  return { user, auth };
}

export async function getUser(email: string) {
  if (!email) {
    throw "email es necesario";
  } else {
    const user = await User.findOne({ where: { email: email } });
    if (user == null) {
      return "user doesn't exist";
    } else {
      return user;
    }
  }
}

export async function logIn(userParams) {
  const { email, password } = userParams;
  const passwordHashed = getSHA256ofString(password);

  const auth = await Auth.findOne({
    where: { email, password: passwordHashed },
  });

  if (auth === null) {
    return { error: "email or pass incorrect" };
  } else {
    const token = jwt.sign({ id: auth.get("user_id") }, secret);
    return token;
  }
}

export function authMiddleware(req, res, next) {
  const splitted = req.headers.authorization.split(" ");
  const token = splitted[1];

  try {
    const data = jwt.verify(token, SECRET);
    req._user = data;
    next();
  } catch (e) {
    throw "error";
  }
}

export async function me(params) {
  const user = await User.findByPk(params.id);
  return user;
}

export async function getAllUsers() {
  if (null) {
    throw "no hay usuarios aun";
  } else {
    const allUsers = User.findAll();
    return allUsers;
  }
}

//publicar mi mascota perdida
export async function pushLostPet(userId, petData) {
  if (!userId) {
    throw "userId es necesario";
  } else {
    const user = await User.findByPk(userId);
    if (user) {
      const pet = await Pet.create({
        ...petData,
        userId: user.get("id"),
      });

      //una vez creada la mascota en postgres esto la sube a algolia con la lat y lng
      const algoliaRes = await index.saveObject({
        objectID: pet.get("id"),
        name: pet.get("name"),
        imageURL: pet.get("imageURL"),
        _geoloc: {
          lat: pet.get("last_location_lat"),
          lng: pet.get("last_location_lgn"),
        },
      });
      console.log(pet, algoliaRes);

      return { pet, algoliaRes };
    }
  }
}
