const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../services/email.services");
const User = require("../models/user.models");
const { registerSchema, loginSchema } = require("../auth.validator");

const registerUser = async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    };
    try {
    const ExistingUser = await User.findOne({ email: value.email });
    if (ExistingUser) {
        return res.status(409).json({ error: "Email already exists" });
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000); 
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
        name: value.name,
        email: value.email,
        password: hashedPassword,   
        verificationToken: verificationToken,
        verificationTokenExpires: verificationTokenExpires
    });
        await newUser.save();
        await sendVerificationEmail(newUser.email, verificationToken);
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server error" });
    }
};

const verifyEmail = async (req, res) => {
const { token } = req.query;

if (!token) {
    return res.status(400).json({ error: "Verification token required" });
}
try {
const user = await User.findOne({ verificationToken: token, verificationTokenExpires: { $gt: new Date() } 
});
if (!user) {
    return res.status(400).json({ error: "Invalid or expired verification token" });
}
user.isVerified = true;
user.verificationToken = null;
user.verificationTokenExpires = null;
await user.save();
return res.status(200).json({ message: "Email verified successfully" });
} catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
}
};

const loginUser = async (req, res) => {
    const{error,value} = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    };
    try {
    const user = await User.findOne({ email: value.email });
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }
    if (!user.isVerified) {
        return res.status(400).json({ error: "Email not verified" });
    }
    const passwordMatch = await bcrypt.compare(value.password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);  
    return res.status(200).json({ message: "Login successful", token: token });
} catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
}
};

const getProfile = async (req, res) => {
    try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
        return res.status(404).json({ error: "User not found" });  
    }
    return res.status(200).json({ user });
} catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
}
};

module.exports = { registerUser, verifyEmail, loginUser, getProfile };