const DEFAULT_TIME = 1500;

let currentTime = DEFAULT_TIME;
let timerInterval = null;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let links = JSON.parse(localStorage.getItem("links")) || [];


function updateTime() {
  const now = new Date();

  document.getElementById("time").textContent = now.toLocaleTimeString();
  document.getElementById("date").textContent = now.toDateString();

  const hour = now.getHours();
  let greeting = "Hello";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  document.getElementById("greeting").textContent = greeting;
}

setInterval(updateTime, 1000);
updateTime();


function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function updateTimerDisplay() {
  document.getElementById("timer").textContent = formatTime(currentTime);
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      updateTimerDisplay();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  currentTime = DEFAULT_TIME;
  updateTimerDisplay();
}

updateTimerDisplay();


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${t.done ? "checked" : ""}>
        <span class="${t.done ? "done" : ""}">${t.text}</span>
      </div>
      <button class="btn-danger">Delete</button>
    `;

    li.querySelector("input").onclick = () => {
      tasks[i].done = !tasks[i].done;
      saveTasks();
      renderTasks();
    };

    li.querySelector(".btn-danger").onclick = () => {
      tasks.splice(i, 1);
      saveTasks();
      renderTasks();
    };

    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");

  if (!input.value.trim()) return;

  tasks.push({ text: input.value, done: false });

  input.value = "";
  saveTasks();
  renderTasks();
}

renderTasks();


function saveLinks() {
  localStorage.setItem("links", JSON.stringify(links));
}

function renderLinks() {
  const container = document.getElementById("links");
  container.innerHTML = "";

  links.forEach((l, i) => {
    const chip = document.createElement("div");
    chip.className = "link-chip";

    const text = document.createElement("span");
    text.textContent = l.name;
    text.onclick = () => window.open(l.url, "_blank");

    const del = document.createElement("span");
    del.textContent = "×";
    del.className = "delete-x";
    del.onclick = () => {
      links.splice(i, 1);
      saveLinks();
      renderLinks();
    };

    chip.appendChild(text);
    chip.appendChild(del);
    container.appendChild(chip);
  });
}

function addLink() {
  const nameInput = document.getElementById("linkName");
  const urlInput = document.getElementById("linkURL");

  const name = nameInput.value.trim();
  const url = urlInput.value.trim();

  if (!name || !url) return;

  links.push({ name, url });

  nameInput.value = "";
  urlInput.value = "";

  saveLinks();
  renderLinks();
}

renderLinks();