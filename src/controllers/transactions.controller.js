import dayjs from "dayjs";
import joi from "joi";
import mongo from "../database/db.js";
let db = await mongo();

const schemaInsertTransaction = joi.object({
  value: joi.number().required(),
  description: joi.string().required(),
  type: joi.valid("entrada").valid("saida").required(),
});

const addTransaction = async (req, res) => {
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
};

const listTransactions = async (req, res) => {
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
};

export { addTransaction, listTransactions };
