import express from "express";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Nova Cloud API is running" });
});

app.post("/task", (req, res) => {
  const task = req.body;
  console.log("Received task:", task);
  res.json({ received: true, task });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Nova Cloud Server running on port", port);
});
