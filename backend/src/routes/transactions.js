import express from "express";
import {
  addTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactions,
  getTransactionsByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/", getTransactions);

router.get("/:userId", getTransactionsByUserId);

router.post("/", addTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:userId", getSummaryByUserId);

export default router;
