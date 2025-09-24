import { sql } from "../config/db.js";

export async function getTransactions(_, res) {
  try {
    const transactions = await sql`
      SELECT * FROM transactions ORDER BY created_at DESC
    `;

    return res.status(200).json({
      message: "Transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("Error getting all transactions", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json({
      message: "Transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("Error getting user transactions", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function addTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !amount || +amount === 0 || !category || !user_id)
      return res.status(400).json({
        message: "All fields are required",
      });

    const [transaction] = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *;
    `;

    res.status(201).json({
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.log("Error creating the transaction", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({
        message: "Transaction ID is required",
      });

    if (!Number(id))
      return res.status(400).json({
        message: "Invalid transaction ID",
      });

    const [transactionToDelete] = await sql`
      SELECT * FROM transactions WHERE id = ${id}
    `;

    if (!transactionToDelete)
      return res.status(400).json({
        message: "Transaction is not found",
      });

    await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    return res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting the transaction", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const [balance] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
    `;

    const [income] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `;

    const [expense] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expense FROM transactions WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      message: "Summary fetched successfully",
      balance: balance.balance,
      income: income.income,
      expense: expense.expense,
    });
  } catch (error) {
    console.error("Error getting summary", error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
