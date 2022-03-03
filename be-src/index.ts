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

  res.json(user);
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
  console.log(req.body);

  const token = await logIn(req.body);

  res.json({ token });
});

//publicar mascota perdida
app.post("/pet", async (req, res) => {
  const pet = await pushLostPet(2, req.body);
  console.log(pet);

  res.json(pet);
});

//mascotas cerca de mi
app.get("/mascotas-cerca-de", async (req, res) => {
  const { lat, lng } = req.query;
  const lostPetsArround = await lostPets(lat, lng);
  //console.log(lostPetsArround);

  res.json(lostPetsArround);
});

//reportar info de mascota
app.post("/report", async (req, res) => {
  console.log("BODYYYYYYYY", req.body);

  const report = await createReport(req.body);
  console.log(report);

  res.json({ message: "ok" });
});

//obtener reportes
app.get("/reports", async (req, res) => {
  const AllReports = await getReports();
  res.json(AllReports);
});

app.get("/me", authMiddleware, async (req, res) => {
  const user = await me(req["_user"].id);
  res.json(user);
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
