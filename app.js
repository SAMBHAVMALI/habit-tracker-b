const habits = JSON.parse(localStorage.getItem("habits")) || [];
const quotes = [
  "Small habits create big results.",
  "Discipline beats motivation.",
  "Consistency is the real flex.",
  "Your future is built daily."
];

const splash = document.getElementById("splash");
const app = document.getElementById("app");
const quoteEl = document.getElementById("quote");
const habitList = document.getElementById("habitList");
const todayEl = document.getElementById("today");

quoteEl.innerText = quotes[Math.floor(Math.random() * quotes.length)];

setTimeout(() => {
  splash.classList.add("hidden");
  app.classList.remove("hidden");
}, 3000);

todayEl.innerText = new Date().toDateString();

function save() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function renderHabits() {
  habitList.innerHTML = "";
  habits.forEach((h, i) => {
    const div = document.createElement("div");
    div.className = "habit";
    div.style.setProperty("--bg", h.color);

    div.innerHTML = `
      <strong>${h.name}</strong>
      <div class="buttons">
        <button onclick="mark(${i}, true)">Done</button>
        <button onclick="mark(${i}, false)">Not Done</button>
        <button onclick="removeHabit(${i})">Remove</button>
      </div>
    `;
    habitList.appendChild(div);
  });
}

function addHabit() {
  const name = prompt("Habit name?");
  if (!name) return;

  habits.push({
    name,
    history: {},
    color: `hsl(${Math.random()*360},70%,85%)`
  });

  save();
  renderHabits();
}

function mark(i, done) {
  const today = new Date().toISOString().slice(0,10);
  habits[i].history[today] = done;
  save();
}

function removeHabit(i) {
  habits.splice(i,1);
  save();
  renderHabits();
}

document.getElementById("addHabitBtn").onclick = addHabit;

renderHabits();

/* PROGRESS */
function showProgress() {
  document.getElementById("progressModal").classList.remove("hidden");
  const ctx = document.getElementById("progressChart");

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: habits.map(h=>h.name),
      datasets: [{
        label: 'Total Done',
        data: habits.map(h =>
          Object.values(h.history).filter(v=>v).length
        )
      }]
    }
  });
}

function closeProgress() {
  document.getElementById("progressModal").classList.add("hidden");
}

function resetData() {
  if(confirm("Delete all data?")){
    localStorage.clear();
    location.reload();
  }
}

/* SERVICE WORKER */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
