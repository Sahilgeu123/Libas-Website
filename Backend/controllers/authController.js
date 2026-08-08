const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

async function registerUser(req, res) {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //TODOS: Hash the password before saving it to the database
    //TODOS: IMPLEMENT JWT TOKEN GENERATION AND RETURN IT IN THE RESPONSE
    //TODOS: OTP VERIFICATION FOR EMAIL CONFIRMATION
    //TODOS: WELCOME EMAIL TO THE USER AFTER SUCCESSFUL REGISTRATION
    //WITH THESE I CAN SAY PROPER SIGNUP FLOW IS IMPLEMENTED

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
      const subject = "Welcome to ShopEase - Email Verification";
      const msg = `
      Welcome to ShopEase!${user.name}. Thankyou for registering. We are
        excited to have you on board. 
        Your OTP for email verification is: ${otp}`;

      await sendMail(user.email, subject, msg);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        message: "Login successful",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
}

async function getUser(req, res) {
  try {
    const users = await User.find().select("-password"); // Exclude the password field from the response
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
}

module.exports = { registerUser, loginUser, getUser };
