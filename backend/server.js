require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./Routes/UserRoutes");

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.error("MongoDB connection failed:", error.message));

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
