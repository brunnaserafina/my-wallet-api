import express from "express";
import cors from "cors";
import authRouters  from "./routers/auth.routers.js";
import transactionsRouters from "./routers/transactions.routers.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use(authRouters);
server.use(transactionsRouters);

server.listen(5000, () => console.log("Listening on port 5000"));
