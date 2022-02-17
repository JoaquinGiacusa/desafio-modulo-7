import { User } from "../models/user";
//import { cloudinary } from "../lib/cloudinary";

export async function createUser(fullName: string, email: string) {
  const user = await User.create({
    fullName,
    email,
  });
  return user;
}

export async function getProfile() {
  const userProfile = await User.findAll();
  console.log("userProfile", userProfile);

  return userProfile;
}
