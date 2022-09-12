import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

export default async function mongo() {
  let db;

  try {
    db = mongoClient.db("mywallet");

    return db;
  } catch (err) {
    console.error(err);
    return err;
  }
}
