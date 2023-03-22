const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const itemsRouter = express.Router();

// BODY PARSER
itemsRouter.use(express.json());
itemsRouter.use(cors());

// API
// GET ALL items
itemsRouter.get("/", (req, res) => {
  pool
    .query("SELECT * FROM items ORDER BY createdAt DESC;")
    .then((data) => {
      console.log(data);
      res.status(200).json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

// GET A SPECIFIC Item WITH ID
itemsRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  pool
    .query("SELECT * FROM items WHERE id=$1;", [id])
    .then((data) => {
      console.log(data);
      if (data.rowCount === 0) {
        res.status(404).json({ message: "Item not found" });
      }
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

module.exports = itemsRouter;
