const express = require("express");
const { authenticateToken } = require("../middleware/auth.middleware");
const { registerUser, verifyEmail, loginUser,getProfile } = require("../controllers/user.controller");


const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, getProfile);
    
module.exports = router;
