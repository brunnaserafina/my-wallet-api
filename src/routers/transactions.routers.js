import express from "express";
import * as transactionsController from "../controllers/transactions.controller.js";

const router = express.Router();

router.get("/transactions", transactionsController.listTransactions);
router.post("/transactions", transactionsController.addTransaction);

export default router;
