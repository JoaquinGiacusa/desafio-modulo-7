import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import { getProfile, createUser } from "./controllers/users-controller";
import { isNumberObject } from "util/types";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3005;
const dev = process.env.NODE_ENV;

//test
app.get("/test", async (req, res) => {
  res.json({ message: "test" });
});

//create user test
app.post("/user", async (req, res) => {
  const { fullName, email } = req.body;

  const user = await createUser(fullName, email);
  res.json(user);
});

//get user test
app.get("/user", async (req, res) => {
  const users = await getProfile();
  res.json(users);
});

//to fe
app.use(express.static("dist"));
const rutaRelativa = path.resolve(__dirname, "../dist/", "index.html");

app.get("*", (req, res) => {
  res.sendFile(rutaRelativa);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
