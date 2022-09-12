import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import joi from "joi";
import mongo from "../database/db.js";
let db = await mongo();

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

const signIn = async (req, res) => {
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
};

const signUp = async (req, res) => {
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
};

const signOut = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  try {
    await db.collection("sessions").deleteOne({ token: token });
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export { signIn, signUp, signOut };
