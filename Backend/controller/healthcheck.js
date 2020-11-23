const express = require("express");
const router = express.Router();

// utility API to check if the server is up and running
router.get("/healthcheck", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
