const express = require("express");
const router = express.Router();
const { users } = require("../controllers");
const { verifyUser } = require("../middlewares/jwtAuth");

router.post("/register", users.registerUser);
router.post("/login", users.loginUser);
router.post("/me", verifyUser, users.me);
router.put("/update", verifyUser, users.updateUser);
router.post("/register-form", users.registerForm); 

module.exports = router;
