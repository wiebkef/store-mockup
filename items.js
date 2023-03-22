const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const itemsRouter = express.Router();

// BODY PARSER
itemsRouter.use(express.json());
itemsRouter.use(cors());

// API
// GET ALL ITEMS
itemsRouter.get("/", (req, res) => {
  pool
    .query("SELECT * FROM items ORDER BY createdat DESC;")
    .then((data) => {
      console.log(data);
      res.status(200).json(data.rows);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

// GET A SPECIFIC ITEM WITH ID
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

// CREATE NEW ITEM
itemsRouter.post("/", (req, res) => {
  const { title, category, description, imageurl, size, color, price } =
    req.body; // form data from body
  pool
    .query(
      "INSERT INTO items (title, category, description, imageurl, size, color, price, createdat) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING id;",
      [title, category, description, imageurl, size, color, price]
    )
    .then((data) => {
      console.log(data);
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

// UPDATE ITEM
itemsRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const { title, category, description, imageurl, size, color, price } =
    req.body; // form data from body
  pool
    .query(
      "UPDATE items SET title=$1, category=$2, description=$3, imageurl=$4, size=$5, color=$6, price=$7 WHERE id=$8 RETURNING *;",
      [title, category, description, imageurl, size, color, price, id]
    )
    .then((data) => {
      console.log(data);
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

// DELETE ITEM
itemsRouter.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  pool
    .query("DELETE FROM items WHERE id=$1 RETURNING *;", [id])
    .then((data) => {
      console.log(data);
      res.json(data.rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

module.exports = itemsRouter;
