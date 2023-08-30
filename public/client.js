var socket = io();
let toggle = false;

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message_area");
let tasksection = document.querySelector(".task-section");

function show() {
  toggle = !toggle;

  if (toggle) {
    tasksection.style.right = "0";
  } else {
    tasksection.style.right = "-200px";
  }
}

let name;
do {
  name = prompt("Please enter your name");
} while (!name);

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
    console.log(e.target.value);
  }
});

function sendMessage(msgs) {
  let msg = {
    user: name,
    message: msgs.trim(),
  };

  //Append
  appendMessage(msg, "outgoing");
  textarea.value = "";

  //send to server
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className, "message");

  let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `;

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

//Receive the message coming

socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
});

//to send the data to the server to add to task
document.getElementById("sendDataButton").addEventListener("click", sendData);
let taskbox = document.querySelector("#taskbox");

function sendData() {
  let doer = prompt("Person to assign task :");
  console.log("sending data");
  const dataToSend = {
    user: doer,
    task: taskbox.value,
  };
  console.log(JSON.stringify(dataToSend));

  fetch("http://localhost:3000/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Response from server:", responseData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
