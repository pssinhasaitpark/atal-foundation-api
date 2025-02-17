const express = require("express");
const router = express.Router();
const { users } = require("../controllers");
const { verifyUser } = require("../middlewares/jwtAuth");
const upload = require('../dbConfig/multer');

const { registerForm } = require("../controllers/user/user");


router.post("/register", users.registerUser);
router.post("/login", users.loginUser);
router.post("/me", verifyUser, users.me);
router.put("/update", verifyUser, users.updateUser);
router.post('/register-form', upload.single('photo'), registerForm); 

module.exports = router;
