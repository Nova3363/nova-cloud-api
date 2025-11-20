
const express = require("express");
const router = express.Router();

router.post("/queue", async (req, res) => {
  res.json({ status: "queued" });
});

module.exports = router;
