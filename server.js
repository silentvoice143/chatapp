const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Connection = require("./mongodb.js");

//connecting the database
Connection();

const Task = require("./model/task.js");
// const router = require(__dirname + "/Route/route.js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

// Serve static files (optional)
app.use(express.static(__dirname + "/public"));
app.use(express.json());

// Set up a route
// app.use("/", router);
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/task", async (req, res) => {
  console.log("received task");
  const task = req.body;
  console.log(task);
  try {
    const newtask = new Task(task);
    await newtask.save();

    res.status(200).json({ message: "task saved successfully" });
  } catch (err) {
    res.status(400).json({ err });
  }
});

app.put("/updatetask", async (req, res) => {
  console.log("received task");
  const task = req.body;
  const user = req.body.user;
  console.log(task);

  try {
    const filter = { user: user, task: task.task }; // Use your own filter
    const update = { $set: { done: task.done } };
    const options = {
      returnOriginal: false, // To get the updated document instead of the original
    };

    const updatedDocument = await Task.findOneAndUpdate(
      filter,
      update,
      options
    );
    if (updatedDocument) {
      console.log(updatedDocument);
      res.status(200).json({ message: "updated successfully" });
    } else {
      res.status(400).json({ message: "not updated successfully" });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});

app.get("/alltask", async (req, res) => {
  try {
    // console.log(req.query);
    const tasks = await Task.find({ user: req.query.name });
    // console.log(tasks);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(400).json({ err });
  }
});

app.delete("/delete", async (req, res) => {
  console.log("deleting task");
  try {
    console.log(req.body);
    const deletionResult = await Task.deleteOne({
      task: req.body.task,
      user: req.body.user,
    });
    if (deletionResult) {
      console.log(deletionResult);
      res.status(200).json({ message: "Successfully deleted the task" });
    } else {
      res.status(400).json({ message: "not deleted the task" });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle messages from client
  socket.on("message", (msg) => {
    // console.log(msg);
    // Broadcast the message to all clients
    socket.broadcast.emit("message", msg);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
