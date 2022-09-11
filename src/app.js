import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
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

const schemaInsertTransaction = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.valid("entrada").valid("saida").required(),
});

server.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.collection("users").findOne({ email });
    const name = user.name;

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

    return res.send({ token, name });
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
      .insertOne({ name, email, password: passwordHash, transactions: [] });

    return res.sendStatus(201);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

server.post("/transactions", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { value, description, type } = req.body;

  const validation = schemaInsertTransaction.validate(
    {
      value,
      description,
      type,
    },
    { abortEarly: false }
  );
  if (validation.error) {
    const err = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(err);
  }

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) {
      return res.status(401).send({ message: "Usuário não está logado" });
    }

    const user = await db.collection("users").findOne({ _id: session.userId });

    const listTransactions = user.transactions;
    let id = Date.now();

    const date = dayjs().format("DD/MM");

    const newValue = Number(value).toFixed(2);

    listTransactions.push({ id, date, value: newValue, description, type });

    await db
      .collection("users")
      .updateOne(
        { _id: session.userId },
        { $set: { transactions: listTransactions } }
      );

    return res.sendStatus(201);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

server.get("/transactions", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) {
      return res.status(401).send({ message: "Usuário não está logado" });
    }

    const user = await db.collection("users").findOne({ _id: session.userId });

    return res.send(user.transactions);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

server.delete("/sign-out", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  try {
    await db.collection("sessions").deleteOne({ token: token });
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

server.listen(5000, () => console.log("Listening on port 5000"));
