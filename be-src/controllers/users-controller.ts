import { User, Auth, Pet, Report } from "../models";
import * as crypto from "crypto";
import { index } from "../lib/algolia";
import * as jwt from "jsonwebtoken";
import { cloudinary } from "../lib/cloudinary";

const secret = process.env.JWT_SECRET;

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
  return { user, auth, created, authCreated };
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
    const token = jwt.sign({ id: auth.get("userId") }, secret);
    return token;
  }
}

export function authMiddleware(req, res, next) {
  const splitted = req.headers.authorization.split(" ");
  const token = splitted[1];

  try {
    const data = jwt.verify(token, secret);
    req._user = data;
    next();
  } catch (e) {
    throw "error";
  }
}

export async function me(params) {
  const user = await User.findByPk(params);

  return user;
}

export async function updateProfile(userId, fullName, password?) {
  console.log(password);

  if (password != undefined) {
    const passwordHashed = getSHA256ofString(password);

    if (fullName && password) {
      const user = await User.update({ fullName }, { where: { id: userId } });
      const auth = await Auth.update(
        { password: passwordHashed },
        { where: { userId: userId } }
      );
      return { user, auth };
    }
  } else if (password == undefined) {
    if (fullName) {
      const user = await User.update({ fullName }, { where: { id: userId } });
      return { user };
    }
  }
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
    petData.lostStatus = true;
    if (petData.imageURL) {
      const imagen = await cloudinary.uploader.upload(petData.imageURL, {
        resource_type: "image",
        discard_original_filename: true,
        width: 1000,
      });

      const user = await User.findByPk(userId);
      if (user) {
        petData.imageURL = imagen.secure_url;
        console.log({ petData });

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
            lng: pet.get("last_location_lng"),
          },
          lastSeen: pet.get("lastSeen"),
          lostStatus: true,
        });

        return { pet, algoliaRes };
      }
    }
  }
}

function bodyToIndex(body, id?) {
  const respuesta: any = {};

  if (body.name) {
    respuesta.name = body.name;
  }
  if (body.imageURL) {
    respuesta.imageURL = body.imageURL;
  }
  if (body.last_location_lat && body.last_location_lng) {
    respuesta._geoloc = {};
    respuesta._geoloc.lat = Number(body.last_location_lat);
    respuesta._geoloc.lng = Number(body.last_location_lng);
  }
  if (body.lastSeen) {
    respuesta.lastSeen = body.lastSeen;
  }
  if (id) {
    respuesta.objectID = id;
    respuesta.lostStatus = true;
  }

  console.log("RESPUESTA", respuesta);

  return respuesta;
}

export async function updatePetInfo(userId, petId, updatedPetInfo) {
  const user = await User.findByPk(userId);

  const pet = await Pet.findByPk(petId);
  if (user && pet) {
    console.log(pet);

    const updateDataComlete = {
      name: updatedPetInfo.name,
      imageURL: updatedPetInfo.imageURL,
      last_location_lat: updatedPetInfo.last_location_lat,
      last_location_lng: updatedPetInfo.last_location_lng,
      lastSeen: updatedPetInfo.lastSeen,
      lostStatus: true,
    };

    if (pet["imageURL"] != updatedPetInfo.imageURL) {
      const imagen = await cloudinary.uploader.upload(updatedPetInfo.imageURL, {
        resource_type: "image",
        discard_original_filename: true,
        width: 1000,
      });

      updateDataComlete.imageURL = imagen.secure_url;

      const petUpdated = await Pet.update(updateDataComlete, {
        where: { id: petId },
      });

      const indexItem = bodyToIndex(updatedPetInfo, petId);
      indexItem.imageURL = imagen.secure_url;
      const algoliaRes = await index.partialUpdateObject(indexItem);

      return { petUpdated, algoliaRes };
    } else {
      const petUpdated = await Pet.update(updateDataComlete, {
        where: { id: petId },
      });
      const indexItem = bodyToIndex(updatedPetInfo, petId);

      const algoliaRes = await index.partialUpdateObject(indexItem);
      return { petUpdated, algoliaRes };
    }
  }
}
export async function deletPet(userId, petId) {
  if (!userId || !petId) {
    throw "faltan datos";
  } else {
    const pet = await Pet.findByPk(petId);

    const petDeleteRes = await pet.destroy();
    const algoliaDeleteRes = await index.deleteObject(petId);

    return { petDeleteRes, algoliaDeleteRes };
  }
}

export async function myPets(userId) {
  if (!userId) {
    throw "userId es neseario";
  } else {
    const myPets = await Pet.findAll({ where: { userId: userId } });
    return myPets;
  }
}

export async function markFound(userId, petId) {
  if (!userId || !petId) {
    throw "faltan datos";
  } else {
    const petFound = await Pet.update(
      { lostStatus: false },
      {
        where: { id: petId },
      }
    );
    const algoliaRes = await index.partialUpdateObject({
      lostStatus: false,
      objectID: petId,
    });

    return { petFound, algoliaRes };
  }
}

export async function onePet(userId, petId) {
  if (!userId) {
    throw "userId es neseario";
  } else {
    const myPet = await Pet.findOne({ where: { userId: userId, id: petId } });
    return myPet;
  }
}
