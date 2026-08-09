const dotenv = require("dotenv");//Loads environment variables from a .env file.
const Razorpay = require("razorpay");//A Node.js library for integrating Razorpay payment gateway.
const crypto = require("crypto");//A built-in Node.js module for cryptographic operations.Used to generate a unique receipt ID.

const createdOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex"),
    };
    const order = await instance.orders.create(options);
    res.status(200).json({
        success: true,
        order,
    });
  }
    catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } 
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");
        if (generated_signature === razorpay_signature) {
            res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid signature sent!",
            });
        }
    } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createdOrder, verifyPayment };