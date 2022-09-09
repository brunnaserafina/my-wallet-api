import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import joi from "joi";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect().then(() => {
  db = mongoClient.db("mywallet");
});

const server = express();
server.use(cors());
server.use(express.json());

const schemaUserRegister = joi
  .object({
    name: joi.string().empty("").required(),
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeatPassword: joi.ref("password"),
  })
  .with("password", "repeatPassword");

server.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).send({ message: "E-mail ou senha incorretos!" });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).send({ message: "E-mail ou senha incorretos!" });
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

server.post("/sign-up", async (req, res) => {
  const { name, email, password, repeatPassword } = req.body;

  const validation = schemaUserRegister.validate(
    {
      name,
      email,
      password,
      repeatPassword,
    },
    { abortEarly: false }
  );
  if (validation.error) {
    const err = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(err);
  }

  try {
    const user = await db.collection("users").findOne({ email });

    if (user) {
      return res.status(409).send({ message: "E-mail já cadastrado!" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await db
      .collection("users")
      .insertOne({ name, email, password: passwordHash });

    return res.sendStatus(201);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

server.listen(5000, () => console.log("Listening on port 5000"));
