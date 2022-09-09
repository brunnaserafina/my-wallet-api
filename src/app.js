import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("mywallet");
});

const server = express();
server.use(cors());
server.use(express.json());

server.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).send("Usuário ou senha incorretas");
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).send("Usuário ou senha incorretas");
    }

    const token = uuid();

    await db.collection("sessions").insertOne({
      userId: user._id,
      token,
    });

    return res.send(token);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

server.listen(5000, () => console.log("Listening on port 5000"));
