const startStopEl = document.getElementById("start-stop");
const resetEl = document.getElementById("reset");
const timerEl = document.getElementById("timer");
const timeInputEl = document.getElementById("time-input");
const pomodoroButton = document.getElementById("pomodoro");
const shortBreakButton = document.getElementById("short-break");
const longBreakButton = document.getElementById("long-break");
const buttonSound = document.getElementById("button-sound");
const finishSound = document.getElementById("finish-sound");
const alertModal = document.getElementById("alert-modal");
const closeModalBtn = document.getElementById("close-modal");
const buttons = document.querySelectorAll("button");
const container = document.querySelector(".container");
const addTaskButton = document.getElementById("add-task");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCompleteSound = document.getElementById("task-sound")


let timeLeft = 25 * 60; // Set initial time to 25 minutes
let isRunning = false;
let mode = "pomodoro"; // Tracks current mode: pomodoro, short-break, long-break
let interval; 

// Sound settings
buttonSound.volume = 0.15;
finishSound.volume = 0.25;
taskCompleteSound.volume = 0.25;

// Button click SFX
buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttonSound.currentTime = 0;
        buttonSound.play();
    });
});

// Format time display (mm:ss)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Update timer display
function updateTimer() {
    timerEl.innerHTML = formatTime(timeLeft);
}

// Start timer
function startTimer() {
    interval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft === 0) {
            clearInterval(interval);
            finishSound.play();
            handleModeSwitch();
        }
    }, 1000);
}

// Handle mode switching 
function handleModeSwitch() {
    if (mode === "pomodoro") {
        mode = "short-break";
        showModal("Pomodoro Finished! Take a short break.");
    } else if (mode === "short-break") {
        mode = "pomodoro";
        showModal("Short break over! Time to get back to work.");
    }
    setTimeByMode();
    updateTimer();
    toggleTimer(); 
}

// Show the modal with a custom message
function showModal(message) {
    document.getElementById('alert-message').textContent = message;
    alertModal.style.display = 'flex';
}

// Close modal on button click
closeModalBtn.addEventListener('click', () => {
    alertModal.style.display = 'none';
});

// Toggle the timer between start and pause
function toggleTimer() {
    if (isRunning) {
        clearInterval(interval);
        startStopEl.innerHTML = "Start";
    } else {
        startTimer();
        startStopEl.innerHTML = "Pause";
    }
    isRunning = !isRunning;
}

// Reset the timer based on the current mode
function resetTimer() {
    clearInterval(interval);
    setTimeByMode();
    updateTimer();
    isRunning = false;
    startStopEl.innerHTML = "Start";
}

// Set the timer duration based on the current mode
function setTimeByMode() {
    if (mode === "pomodoro") {
        timeLeft = 25 * 60;
    } else if (mode === "short-break") {
        timeLeft = 5 * 60;
    } else if (mode === "long-break") {
        timeLeft = 15 * 60;
    }
}

// Change background color based on the selected mode
function changeBackgroundColor(color) {
    container.style.backgroundColor = color;
}

// Mode button event listeners to change mode and reset timer
pomodoroButton.addEventListener('click', () => {
    mode = "pomodoro";
    resetTimer();
    changeBackgroundColor('#a2d2ff'); // Light blue for Pomodoro
});

shortBreakButton.addEventListener('click', () => {
    mode = "short-break";
    resetTimer();
    changeBackgroundColor('#ffd166'); // Yellow for Short Break
});

longBreakButton.addEventListener('click', () => {
    mode = "long-break";
    resetTimer();
    changeBackgroundColor('#a8dadc'); // Mint for Long Break
});

// Task list functionality
addTaskButton.addEventListener("click", () => {
    addTaskButton.style.display = 'none';  
    taskForm.style.display = 'block';      
    taskInput.focus();                     
});

taskForm.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const taskText = taskInput.value.trim(); 
    if (taskText === '') return; 

    // Create a new task item
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `
        <span>${taskText}</span>
        <button class="delete-task">X</button>
    `;

    // Add delete functionality to the task
    taskItem.querySelector('.delete-task').addEventListener('click', () => {
        taskItem.remove(); 
    });

    taskList.appendChild(taskItem);
    taskInput.value = '';
    taskForm.style.display = 'none';
    addTaskButton.style.display = 'inline'; 
});

// Marking tasks as completed
taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
        e.target.classList.toggle('completed'); 

    if (e.target.classList.contains('completed')) {
        taskCompleteSound.currentTime = 0;
        taskCompleteSound.play();
    }
    }
});

startStopEl.addEventListener("click", toggleTimer);
resetEl.addEventListener("click", resetTimer);

updateTimer();
