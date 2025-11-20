
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const jobsRoutes = require("./routes/jobs");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Nova Cloud API is running");
});

app.use("/auth", authRoutes);
app.use("/jobs", jobsRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on ${port}`));
