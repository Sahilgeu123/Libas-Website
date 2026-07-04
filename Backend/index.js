const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config(); 
connectDB();

const app = express();
app.use(cors());

app.get("/",(req,res)=>{
    res.send("backend working");
})


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})
