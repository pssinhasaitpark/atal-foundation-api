const express = require("express");
const router = express.Router();
const { users } = require("../controllers");
const { verifyUser } = require("../middlewares/jwtAuth");
const { upload, convertImagesToWebP } = require('../middlewares/fileUploader');

const { registerForm } = require("../controllers/user/user");
const sendRegistrationEmail = require("../middlewares/sendEmailMiddleware");


router.post("/register", users.registerUser);
router.post("/login", users.loginUser);
router.get("/me", verifyUser, users.me);
router.patch("/update", verifyUser, users.updateUser);
router.post('/register-form', upload, convertImagesToWebP, sendRegistrationEmail, registerForm);
router.post("/forgot-password", users.forgotPassword);
router.post("/reset-password", users.resetPassword); 
router.get("/users", users.getAllRegitations);

module.exports = router;
 