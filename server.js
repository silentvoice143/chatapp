const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
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
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle messages from client
  socket.on("message", (msg) => {
    // console.log(msg);
    socket.broadcast.emit("message", msg); // Broadcast the message to all clients
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
