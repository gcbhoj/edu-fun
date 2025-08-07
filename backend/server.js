require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT;
const uri = process.env.ATLAS_URI;

app.use(express.json());
app.use(cors());

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB Connection established");
  })
  .catch((error) => {
    console.error("MongoDb connection Failed:", error.message);
  });

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
