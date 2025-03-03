const jwt = require("jsonwebtoken");
const {userRegistrationSchema,userLoginSchema, userRegistrationFormSchema} = require("../vailidators/usersValidaters");
const { errorResponse, successResponse } = require("../../utils/helper");
const { Users } = require("../../models");
const UserForm = require("../../models/userForm");
const { jwtAuthentication } = require("../../middlewares");
const cloudinary = require("../../middlewares/cloudinary");
const {handleResponse}= require('../../utils/helper')
const sendEmail = require('../../utils/emailHandler')
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
exports.registerUser = async (req, res) => {
  const { error } = userRegistrationSchema.validate(req.body);
  if (error) {
    return handleResponse(res, 400, error.details[0].message);
  }

  const { user_name, first_name, last_name, email, mobile, password } =
    req.body;

  try {
    const existingUser = await Users.findOne({
      $or: [{ user_name }, { email }],
    });

    if (existingUser) {
      let errorMessage = "";
      if (existingUser.user_name === user_name) {
        errorMessage += "Username is already taken. ";
      }
      if (existingUser.email === email) {
        errorMessage += "Email is already registered.";
      }
      return handleResponse(res, 400, errorMessage.trim());
    }

    const data = {
      user_name,
      first_name,
      last_name,
      email,
      mobile,
      password,
      user_role: "user",
    };

    const newUser = new Users(data);
    await newUser.save();
    return handleResponse(res, 201, "User created successfully!", { user_name, first_name, last_name, email, mobile, user_role: "user" });
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "An error occurred while registering user.", { error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) return handleResponse(res, 400, error.details[0].message);

  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return handleResponse(res, 400, "Invalid username or password.");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return handleResponse(res, 400, "Invalid username or password.");
    }

    const accessToken = await jwtAuthentication.signAccessToken(
      user.id,
      user.user_role
    );
    const encryptedToken = jwtAuthentication.encryptToken(accessToken);

    if (user.user_role === "super-admin") {
      console.log("Super Admin Login Succesfully");
      return successResponse(
        res,
        `Super Admin Login Successfully!`,
        { encryptedToken },
        200
      );
    } else if (user.user_role === "admin") {
      console.log("Admin Login Succesfully");

      return successResponse(
        res,
        `Admin Login successfully!`,
        { encryptedToken , user_role: "admin"},
        200
      );
    }

    return successResponse(
      res,
      `User Login successfully!`,
      { encryptedToken , user_role: "user"},
      200
    );
  } catch (error) {
    return handleResponse(res, 500, "An unexpected error occurred during login.", { error: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    if (!req.user || !req.user.user_id) {
      return handleResponse(res, 401, "Unauthorized user");
    }

    const user = await Users.findOne({ _id: req.user.user_id });

    if (!user) {
      return handleResponse(res, 404, "User not found");
    }

    return handleResponse(res, 200, "User details retrieved successfully!", { user });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return handleResponse(res, 500, "Internal server error", { error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { user_name, first_name, last_name, email, mobile, password } =
    req.body;

  try {
    const user = await Users.findById(req.user.user_id);
    if (!user) {
      return handleResponse(res, 404, "User not found.");
    }

    if (user_name) user.user_name = user_name;
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (password) user.password = password;

    await user.save();

    return handleResponse(res, 200, "User updated successfully!", { user_name, first_name, last_name, email, mobile });
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "An error occurred while updating the user.", { error: error.message });
  }
};

exports.registerForm = async (req, res) => {
  const { error } = userRegistrationFormSchema.validate(req.body);
  if (error) {
    return handleResponse(res, 400, error.details[0].message);
  }

  const { first_name, last_name, email, mobile, address, gender, date_of_birth, city, state, category, designation, message } = req.body;

  try {
    console.log("Uploaded Files:", req.files);
    let imageUrls = [];

    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        try {
          const uploadedImage = await cloudinary.uploadImageToCloudinary(file.buffer);
          console.log("Cloudinary Upload Response:", uploadedImage);
          if (uploadedImage) {
            imageUrls.push(uploadedImage);
          }
        } catch (uploadError) {
          console.error("Cloudinary Upload Failed:", uploadError);
        }
      }
    }

    const data = {
      first_name,
      last_name,
      email,
      mobile,
      address,
      gender,
      date_of_birth,
      city,
      state,
      category,
      designation,
      message,
      images: imageUrls,
      user_role: "user",
      user_id: new mongoose.Types.ObjectId(),
    };

    console.log("Final Image URLs:", imageUrls);

    const newUserForm = new UserForm(data);
    await newUserForm.save();

    return handleResponse(res, 201, "User Registration Form Successfully Submitted!", data);
  } catch (error) {
    console.error("Form Submission Error:", error);
    return handleResponse(res, 500, "An error occurred while submitting the form.", { error: error.message });
  }
};

exports.getAllRegitations = async (req, res) => {
  try {
    const users = await UserForm.find();
    return handleResponse(res, 200, "All Registered Users Fetched Successfully", users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return handleResponse(res, 500, "An error occurred while fetching users.", { error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });

    if (!user || (user.user_role !== "admin" && user.user_role !== "super-admin")) {
      return handleResponse(res, 404, "Access Denied: Admins Not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000; 

    user.resetToken = resetToken;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    
    const emailContent = `
      Password Reset Request
      Click the link below to reset your password:
      "${resetLink}"
    This link is valid for 1 hour.
    `;


    await sendEmail(user.email, "Password Reset Request", emailContent);

    return handleResponse(res, 200, "Password reset link sent to your email");
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "An error occurred while sending the email");
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await Users.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now()+360000 },
    });

    if (!user) {
      return handleResponse(res, 400, "Invalid or expired token");
    }
console.log("newPassword=====",newPassword);
    // user.password = await bcrypt.hash(newPassword, 10);
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return handleResponse(res, 200, "Password reset successful");
  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "An error occurred while resetting password");
  }
};


