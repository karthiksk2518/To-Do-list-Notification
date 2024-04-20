const addTaskButton = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#task-input");
const taskTimeInput = document.querySelector("#task-time");
const countValue = document.querySelector(".count-value");
const taskList = document.querySelector(".task-list");

let taskCount = 0;

const displayCount = (taskCount) => {
    countValue.innerText = taskCount;
};

window.addEventListener('load', () => {
    taskCount = 0;
    taskList.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('task-')) {
            const taskId = parseInt(key.split('-')[1]);
            const taskData = JSON.parse(localStorage.getItem(key));
            createTaskItem(taskData.text, taskData.time, taskId);
            taskCount++;
        }
    }
    displayCount(taskCount);
});

newTaskInput.setAttribute("autocomplete", "off"); // Disable Autocomplete for task input field

const createTaskItem = (taskText, taskTime, taskId) => {
    const li = document.createElement('li');
    li.classList.add("task-li");
    taskList.appendChild(li);

    const taskContainer = document.createElement('div');
    taskContainer.classList.add("task-container");

    const taskContent = document.createElement('div');
    taskContent.textContent = taskText;
    taskContent.classList.add("task-content");
    taskContainer.appendChild(taskContent);

    // Edit Task in List

    const editButton = document.createElement('button');
    editButton.textContent = "Edit";
    editButton.classList.add("material-symbols-outlined");
    editButton.id = "edit-btn";

    editButton.addEventListener('click', () => {
        const newText = prompt("Edit task:", taskContent.textContent);
        if (newText !== null && newText.trim() !== '') {
            taskContent.textContent = newText.trim();
            const taskData = JSON.parse(localStorage.getItem(`task-${taskId}`));
            taskData.text = newText.trim();
            localStorage.setItem(`task-${taskId}`, JSON.stringify(taskData)); // Update task in localStorage
        }
    });

    const taskButtons = document.createElement('div');
    taskButtons.classList.add("task-buttons");

    taskButtons.appendChild(editButton);

    // Delete Task from List

    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("material-symbols-outlined");

    deleteButton.addEventListener('click', () => {
        taskList.removeChild(li);
        localStorage.removeItem(`task-${taskId}`); // Remove task from localStorage
        taskCount--;
        displayCount(taskCount);
    });
    taskButtons.appendChild(deleteButton);

    taskContainer.appendChild(taskButtons);

    li.appendChild(taskContainer);

    // Calculate time remaining for each task and set up notifications
    const currentTime = new Date().getTime();
    const taskDueTime = new Date(taskTime).getTime();
    const timeRemaining = taskDueTime - currentTime;

    if (timeRemaining > 0) {
        setTimeout(() => {
            // Notify user when task time is due
            showNotification(`Task "${taskText}" is due now!`);
        }, timeRemaining);
    }
};

function showNotification(message) {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification(message);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(message);
                }
            });
        }
    }
}

addTaskButton.addEventListener('click', () => {
    const taskText = newTaskInput.value.trim();
    const taskTime = taskTimeInput.value;

    if (taskText === '') {
        alert("Enter task");
        return;
    }

    const taskId = taskCount;
    createTaskItem(taskText, taskTime, taskId);
    localStorage.setItem(`task-${taskId}`, JSON.stringify({ text: taskText, time: taskTime })); // Store task in localStorage

    taskCount++;
    displayCount(taskCount);

    newTaskInput.value = '';
    taskTimeInput.value = '';
});

newTaskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const taskText = newTaskInput.value.trim();
        const taskTime = taskTimeInput.value;

        if (taskText === '') {
            alert("Enter task");
            return;
        }

        const taskId = taskCount;
        createTaskItem(taskText, taskTime, taskId);
        localStorage.setItem(`task-${taskId}`, JSON.stringify({ text: taskText, time: taskTime })); // Store task in localStorage

        taskCount++;
        displayCount(taskCount);

        newTaskInput.value = '';
        taskTimeInput.value = '';
    }
});