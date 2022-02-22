import { User, Auth, Pet, Report } from "../models";
import { index } from "../lib/algolia";

export async function lostPets(lat, lng) {
  console.log(lat, lng);

  const { hits } = await index.search("", {
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 1000,
  });

  return hits;
}
