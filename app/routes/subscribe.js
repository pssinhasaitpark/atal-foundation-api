const express = require("express");
const router = express.Router();
const { subscribers } = require("../controllers");

router.post("/create", subscribers.subscribeUser); 
router.get("/", subscribers.getAllSubscribers); 

module.exports = router;
 
