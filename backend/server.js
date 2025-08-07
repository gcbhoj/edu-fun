require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./Routes/UserRoutes");

const app = express();
const port = process.env.PORT;
const uri = process.env.ATLAS_URI;

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);

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
