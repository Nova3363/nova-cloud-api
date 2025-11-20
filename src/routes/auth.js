
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.post("/login", async (req, res) => {
  res.json({ status: "login ok" });
});

module.exports = router;
