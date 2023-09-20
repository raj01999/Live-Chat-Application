const socket = io("https://live-chat-server-821q.onrender.com");
const form = document.getElementById("msg-send");
const input = document.getElementById("msg-input");
const btn = document.getElementById("msg-submit");
const msgContainer = document.getElementById("msg-container");
const userOnline = document.getElementById("user-online");
const audio = new Audio("./assets/noti.mp3");
const html = document.getElementsByTagName("html")[0];

input.focus();
html.addEventListener("keypress", () => {
  input.focus();
});

const append = (msg, pos, type) => {
  const ele = document.createElement("p");
  ele.innerText = msg;
  ele.classList.add("msg");
  ele.classList.add(pos);
  ele.classList.add(type);
  msgContainer.appendChild(ele);
  msgContainer.scrollTop = msgContainer.scrollHeight;
  if (pos === "left") {
    audio.play();
  }
};

const name = prompt("Please! Enter your name over 3 character...");
if (name && name.length >= 3) {
  socket.emit("new-user-join", {
    name: name,
    time: String(new Date()).split(" ")[4],
  });
} else {
  append(`~ Name should be more than 3 character ~`, "left", "hate");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = input.value;
  if (!msg) return;
  socket.emit("msg-send", msg);
  input.value = "";
  input.focus();
});

const appendUser = (users) => {
  users = Object.values(users);
  let htmlTxt = "";
  users.forEach((obj) => {
    htmlTxt += ` <li>
    <span class="green-dot"> &#128994;</span> <span>${obj.name.toUpperCase()} ~${
      obj.time
    }</span>
  </li>`;
  });
  userOnline.innerHTML = htmlTxt;
};

const checker = (users) => {
  if (users[socket.id]) return true;
  return false;
};

socket.on("user-join", (obj) => {
  if (checker(obj.users)) {
    append(`~ ${obj.name} join the chat ~`, "left", "love");
    appendUser(obj.users);
  } else {
    location.href = "./";
  }
});

socket.on("append-user", (users) => {
  appendUser(users);
});

socket.on("msg-permission", (msg) => {
  append(`You: ${msg}`, "right", "msg");
});

socket.on("no-user", (vari) => {
  location.href = "./";
});

socket.on("left", (obj) => {
  if (checker(obj.users)) {
    append(`~ ${obj.name} left the chat ~`, "left", "hate");
    appendUser(obj.users);
  } else {
    location.href = "./";
  }
});

socket.on("msg-receive", (obj) => {
  if (checker(obj.users)) {
    append(`${obj.name}: ${obj.msg}`, "left", "msg");
  } else {
    location.href = "./";
  }
});
