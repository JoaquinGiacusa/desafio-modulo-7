import * as express from "express";
import * as cors from "cors";
import * as path from "path";

//user-controller
import {
  createUser,
  getAllUsers,
  pushLostPet,
} from "./controllers/users-controller";

//pet-controller
import { lostPets } from "./controllers/pets-collection";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3005;
const secret = process.env.JWT_SECRET;

//test
app.get("/test", async (req, res) => {
  res.json({ message: "test" });
});

//===>ACA ARRANCA

//signup
app.post("/auth", async (req, res) => {
  const { fullName, email, password } = req.body;

  const user = await createUser(fullName, email, password);

  res.json(user);
});

app.get("/users", async (req, res) => {
  const allUsers = await getAllUsers();
  res.json(allUsers);
});

//publicar mascota perdida
app.post("/pet", async (req, res) => {
  const pet = await pushLostPet(1, req.body);
  res.json(pet);
});

//mascotas cerca de mi
app.get("/mascotas-cerca-de", async (req, res) => {
  const { lat, lng } = req.query;
  console.log("express", lat, lng);

  const lostPetsArround = await lostPets(lat, lng);

  res.json(lostPetsArround);
});

//---->
//to fe
app.use(express.static("dist"));
const rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");

app.get("*", (req, res) => {
  res.sendFile(rutaRelativa);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
