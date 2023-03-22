const express = require("express");
require("dotenv/config");
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require("cors");

// BODY PARSER
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("<h1>Items API</h1>");
});

const itemsRouter = require("./items.js");
app.use("/api/items", itemsRouter);

app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
