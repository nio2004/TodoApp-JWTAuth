require('dotenv').config()

const express = require("express");
const cors = require("cors");
const redis = require("redis");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const app = express();
// app.use(cors)
app.use(express.json());

const client = redis.createClient();
client.connect().then(() => {
  console.log("Connected to Redis");
});

let refreshTokens = [];

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
//   console.log(token)
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s'});
}

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.post("/login", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Data is required" });
  }
  // const  data  = req.body;
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  const user = { name: username }
  try {
    const storedPassword = await client.hGet("users", username);
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    if (!storedPassword) {
      res.status(400).json({ error: "Username Or Password not found" });
    } else if (storedPassword === password) {
      res.json({
        message: "Login successful",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      res.status(400).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/signup", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "Data is required" });
  }
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const userExists = await client.exists("users", username);
    if (userExists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    await client.hSet("users", username, password);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/task", async (req, res) => {
  const { userid, taskbody, tasktime } = req.body;

  if (!userid || !taskbody || !tasktime) {
    return res
      .status(400)
      .json({ error: "Userid, task title, and task time are required" });
  }

  const taskid = uuidv4(); // Generate a unique task ID

  try {
    const taskKey = `task:${taskid}:${userid}`;
    await client.hSet(taskKey, "taskbody", taskbody);
    await client.hSet(taskKey, "tasktime", tasktime);
    res.status(201).json({ message: "Task created successfully", taskid });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/tasks/:userid", authenticateToken, async (req, res) => {
  const { userid } = req.params;
  console.log(`${userid}`);
  try {
    const keys = await client.keys(`task:*:${userid}`);
    console.log(keys);
    const tasks = [];
    for (const key of keys) {
      const task = await client.hGetAll(key);
      // console.log(task)
      tasks.push({ ...task });
      // tasks.push({ ...task, taskid: key.split(':')[1] });
    }

    if (tasks.length === 0) {
      return res.status(404).json({ error: "No tasks found for the user" });
    }

    res.status(200).json(tasks);

    // res.status(200).json({"msg":"finish"});
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/task/:userid/:taskid", async (req, res) => {
  const { userid, taskid } = req.params;

  try {
    const taskKey = `task:${taskid}:${userid}`;
    const exists = await client.exists(taskKey);
    if (!exists) {
      return res.status(404).json({ error: "Task not found" });
    }

    await client.del(taskKey);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
