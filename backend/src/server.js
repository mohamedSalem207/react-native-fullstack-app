import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactions.js";
import { initDB } from "./config/db.js";

dotenv.config();

const app = express();

app.use(rateLimiter);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/transactions", transactionsRoute);

const port = process.env.PORT || 5001;

initDB().then(() => {
  app.listen(port, () => {
    console.log("Server is up and running on PORT:5001");
  });
});
