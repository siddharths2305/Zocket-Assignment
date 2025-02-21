require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const http = require("http");
const { Server } = require("socket.io");
const { Configuration, OpenAIApi } = require("openai");

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Initialize OpenAI API
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

// User Model
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  password: String,
}));

// Task Model
const Task = mongoose.model("Task", new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String,
  status: { type: String, default: "Pending" },
}));

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("New WebSocket connection:", socket.id);
  socket.on("taskUpdate", (data) => {
    io.emit("taskUpdate", data);
  });
});

// User Registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.json({ message: "User registered successfully" });
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });
  
  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Create Task
app.post("/tasks", authMiddleware, async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  io.emit("taskUpdate", task); // Real-time update
  res.json(task);
});

// Get All Tasks
app.get("/tasks", authMiddleware, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Update Task
app.put("/tasks/:id", authMiddleware, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  io.emit("taskUpdate", task);
  res.json(task);
});

// AI Task Suggestion
app.post("/suggest-task", authMiddleware, async (req, res) => {
  const { description } = req.body;
  const response = await openai.createCompletion({
    model: "gpt-4",
    prompt: `Suggest a task based on: ${description}`,
    max_tokens: 100,
  });
  res.json({ suggestion: response.data.choices[0].text.trim() });
});

// Start Server
server.listen(process.env.PORT || 5000, () => console.log("🚀 Server running on port 5000"));
