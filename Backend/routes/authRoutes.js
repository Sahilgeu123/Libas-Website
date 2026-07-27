const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser } = require("../controllers/authController");
const { protected } = require("../middleware/auth.Middleware");
const { admin } = require("../middleware/admin.Miiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protected, admin, getUser);
//middleware- protected, admin

module.exports = router;