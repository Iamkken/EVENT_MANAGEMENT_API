const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./src/routes/user.routes");



const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to EventHorizon API");
});


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });
    




app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});