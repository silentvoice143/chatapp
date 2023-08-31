var socket = io();
let toggle = false;

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message_area");
let tasksection = document.querySelector(".task-section");
let love = document.querySelector(".love");
let p = document.querySelector(".p");
let taskcontainer = document.querySelector(".task-container");

//
//
//
//
//

function showtask() {
  toggle = !toggle;

  if (toggle) {
    tasksection.style.transform = "scaleY(1)";
  } else {
    tasksection.style.transform = "scaleY(0)";
  }
}

let name;

do {
  name = prompt("Please enter your name");
} while (!name);

if (name.toLowerCase() === "bhawika") {
  love.style.display = "block";
  p.style.display = "block";
}

if (name.length !== 0) {
  console.log("fetching task");
  getdata();
}

//
//
//
//

function getdata() {
  console.log("getting data");
  fetch(`http://localhost:3000/alltask?name=${name}`, {
    method: "GET",
    headers: {
      params: { name: name },
    },
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Response from server:", responseData[0]);

      for (let i = 0; i < responseData.length; i++) {
        // console.log(responseData[i]);
        // console.log(responseData[i].task);
        // console.log(responseData[i].user);

        let listElement = document.createElement("li");
        let taskelement = document.createElement("span");
        taskelement.classList.add("taskname");
        taskelement.innerHTML = responseData[i].task;
        // console.log(taskelement);
        if (responseData[i].done === true) {
          taskelement.style.textDecoration = "line-through";
        }
        listElement.classList.add("task-item");

        listElement.innerHTML = `<span class="doer">${responseData[i].user}</span><button id="delbtn" class="task-button">X</button>`;
        listElement.prepend(taskelement);
        console.log(listElement);
        taskcontainer.appendChild(listElement);

        listElement.addEventListener("click", (e) => {
          // console.log(e.target);
          let child1 = e.target.children[0];
          let child2 = e.target.children[1];
          if (child1.style.textDecoration === "line-through") {
            child1.style.textDecoration = "";
            setdone({
              task: child1.innerHTML,
              user: child2.innerHTML,
              done: false,
            });
          } else {
            child1.style.textDecoration = "line-through";
            setdone({
              task: child1.innerHTML,
              user: child2.innerHTML,
              done: true,
            });
          }

          console.log(child1.innerHTML + child2.innerHTML);
        });

        $(".task-item").on("click", "#delbtn", (e) => {
          deletetask({
            task: $(e.target).parent().children()[0].innerHTML,
            user: $(e.target).parent().children()[1].innerHTML,
          });

          // console.log($(e.target).parent().children()[0].innerHTML);
          // console.log($(e.target).parent().children()[1].innerHTML);
          $(e.target).parent().remove();
        });

        // listElement.children[2].addEventListener("click", (e) => {
        //   // console.log(e);
        //   let parent = e.target.parentNode.remove();
        //   deletetask(
        //     listElement.children[0].innerHTML,
        //     listElement.children[1].innerHTML
        //   );
        //   console.log(parent);
        // });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//
//

//
//

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    console.log("sending message");
    sendMessage(e.target.value);
    console.log(e.target.value);
  }
});

let taskbtn = document.querySelector("#taskbtn");

// taskbtn.addEventListener("click", (e) => {
//   getdata();
// });

function setdone(data) {
  console.log(data);
  fetch("http://localhost:3000/updatetask", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Response from server:", responseData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function deletetask(data) {
  console.log(data);
  fetch("http://localhost:3000/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Response from server:", responseData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

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
  console.log(markup);

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

//Receive the message coming

socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
});

//
//
//
//
//to send the data to the server to add to task
document.getElementById("sendDataButton").addEventListener("click", sendData);
let taskbox = document.querySelector("#taskbox");

function sendData() {
  let doer = prompt("Person to assign task :");
  console.log("sending data");
  const dataToSend = {
    user: doer,
    task: taskbox.value,
    done: false,
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
