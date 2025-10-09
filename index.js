// https://mern-chatting-application.vercel.app/getAllMessage

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Enable CORS before defining routes
app.use(
  cors({
    origin: [
      "http://localhost:5174", // your local React app
      "http://localhost:5173", // your local React app
      "https://react-js-psi-beryl.vercel.app" // your deployed frontend (if applicable)
    ],
    methods: ["GET", "POST"],
    credentials: true
  })
);

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// ✅ Schema and Model
const chatSchema = new mongoose.Schema({
  userName: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const chatModel = mongoose.model("Chat", chatSchema);

// ✅ Routes
app.get("/", (req, res) => {
  console.log("Inside / route");
  res.send("Hello World!");
});

app.get("/getAllMessage", async (req, res) => {
  console.log("Inside /getAllMessage route");
  //   let data = await chatModel.find();
  let data = await chatModel.find().select("-_id -__v");
  console.log("Sent Data Length ::", data.length);
  res.send(data);
});

app.post("/addMessage", async (req, res) => {
  console.log("Inside /addMessage route");
  let requestBody = req.body;
  let data = new chatModel(requestBody);
  const result = await data.save();
  console.log("Result ::", result?._id);
  res.send(result);
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});