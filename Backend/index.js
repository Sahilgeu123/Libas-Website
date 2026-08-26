const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();

// Configure CORS to allow requests from the frontend and support credentials

const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Express 5 requires named wildcard parameters. This covers every preflight URL,
// including the root path.
app.options("/{*path}", cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("backend working");
})

app.use('/api/auth', authRoutes);
app.use('/api/products', require('./routes/productRoutes'))
app.use('/api/orders', require('./routes/orderRoutes'))
app.use('/api/payment', require('./routes/paymentRoutes'))
app.use('/api/analytics', require('./routes/analyticsRoutes'))
app.use('/api/ai',require('./routes/aiRoutes'))
app.use('/api/wishlist',require('./routes/wishlistRoutes'))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})
