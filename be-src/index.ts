import * as express from "express";
import * as cors from "cors";
import * as path from "path";

//user-controller
import {
  getUser,
  createUser,
  getAllUsers,
  pushLostPet,
  logIn,
  me,
  authMiddleware,
  updateProfile,
  myPets,
  onePet,
  updatePetInfo,
  deletPet,
  markFound,
} from "./controllers/users-controller";

//pet-controller
import {
  lostPets,
  getReports,
  createReport,
} from "./controllers/pets-collection";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3005;

//test
app.get("/test", async (req, res) => {
  res.json({ message: "test" });
});

//===>ACA ARRANCA

//signup
app.post("/auth", async (req, res) => {
  const { fullName, email, password } = req.body;
  const user = await createUser(fullName, email, password);

  res.json({ user });
});

app.get("/users", async (req, res) => {
  const allUsers = await getAllUsers();
  res.json(allUsers);
});

//buscar un user para ver si existe
app.get("/users/:email", async (req, res) => {
  const { email } = req.params;
  const user = await getUser(email);
  res.json(user);
});

//signin or login
app.post("/auth/token", async (req, res) => {
  const token = await logIn(req.body);

  res.json({ token });
});

//publicar mascota perdida
app.post("/pet", authMiddleware, async (req, res) => {
  const userId = req["_user"].id;
  const pet = await pushLostPet(userId, req.body);

  res.json({ pet });
});

app.put("/update-pet", authMiddleware, async (req, res) => {
  const userId = req["_user"].id;
  const updatedPetInfo = req.body.updatedPetInfo;
  const petId = req.body.petId;

  const petEdited = await updatePetInfo(userId, petId, updatedPetInfo);

  res.json(petEdited);
});

app.put("/mark-found/:petId", authMiddleware, async (req, res) => {
  const userId = req["_user"].id;
  const petId = req.params.petId;

  const petEdited = await markFound(userId, petId);

  res.json(petEdited);
});

app.delete("/delet-pet/:petId", authMiddleware, async (req, res) => {
  const userId = req["_user"].id;
  const petId = req.params.petId;

  const deletStatus = await deletPet(userId, petId);

  res.json(deletStatus);
});

//mascotas de cada usuario
app.get("/my-pets", authMiddleware, async (req, res) => {
  const userId = req["_user"].id;

  const allMyPets = await myPets(userId);

  res.json(allMyPets);
});

//mascota por id
app.get("/pet/:petId", authMiddleware, async (req, res) => {
  const userId = req["_user"].id;
  const petId = req.params.petId;

  const onePetById = await onePet(userId, petId);

  res.json(onePetById);
});

//mascotas cerca de mi
app.get("/mascotas-cerca-de", async (req, res) => {
  const { lat, lng } = req.query;
  const lostPetsArround = await lostPets(lat, lng);

  res.json(lostPetsArround);
});

//reportar info de mascota
app.post("/report", async (req, res) => {
  const report = await createReport(req.body);

  res.json({ message: "ok" });
});

//obtener reportes
app.get("/reports", async (req, res) => {
  const AllReports = await getReports();
  res.json(AllReports);
});

app.get("/profile", authMiddleware, async (req, res) => {
  const user = await me(req["_user"].id);
  res.json(user);
});

//actualizar perfil
app.post("/update-profile", authMiddleware, async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "me faltan datos en el body",
    });
  }

  const { fullName, password } = req.body;

  const userId = req["_user"].id;

  if (password == undefined) {
    const updatedData = await updateProfile(userId, fullName);
    res.json(updatedData);
  } else if (password != undefined) {
    const updatedData = await updateProfile(userId, fullName, password);
    res.json(updatedData);
  }
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
