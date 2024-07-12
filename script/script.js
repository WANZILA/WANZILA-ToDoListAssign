
document.addEventListener('DOMContentLoaded', loadTasks);

// Add event listeners for adding a task
document.getElementById('add-task').addEventListener('click', addTask);
document.getElementById('new-task').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});

function loadTasks() {
    // Retrieve tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Render each task
    tasks.forEach(task => renderTask(task));
}

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    if (taskText) {
        // Create a new task object
        const task = { text: taskText, completed: false };
        // Render the task
        renderTask(task);
        // Save the task to localStorage
        saveTask(task);
        // Clear the input field
        taskInput.value = '';
    }
}

function renderTask(task) {
    const taskList = document.getElementById(task.completed ? 'completed-task-list' : 'task-list');
    // Create a new list item element
    const li = document.createElement('li');
    li.className = 'list-group-item';
    if (task.completed) li.classList.add('completed');
    
    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <div class="task-actions">
            <button class="complete-task btn btn-sm"><i class="fas fa-check"></i></button>
            <button class="edit-task btn btn-sm"><i class="fas fa-edit"></i></button>
            <button class="delete-task btn btn-sm"><i class="fas fa-trash"></i></button>
        </div>
    `;

    // Add event listeners for the action buttons
    li.querySelector('.complete-task').addEventListener('click', () => toggleComplete(li, task));
    li.querySelector('.edit-task').addEventListener('click', () => editTask(li, task));
    li.querySelector('.delete-task').addEventListener('click', () => deleteTask(li, task));
    
    // Append the list item to the appropriate task list
    taskList.appendChild(li);
}

function toggleComplete(li, task) {
    task.completed = !task.completed;
    li.classList.toggle('completed');
    li.remove(); // Remove from current list
    const newList = document.getElementById(task.completed ? 'completed-task-list' : 'task-list');
    newList.appendChild(li); // Append to the appropriate list
    updateLocalStorage();
}

function editTask(li, task) {
    const newText = prompt('Edit your task:', task.text);
    if (newText) {
        task.text = newText;
        li.querySelector('.task-text').textContent = newText;
        updateLocalStorage();
    }
}

function deleteTask(li, task) {
    li.remove();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(t => t.text !== task.text);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#task-list li, #completed-task-list li').forEach(li => {
        const task = {
            text: li.querySelector('.task-text').textContent,
            completed: li.classList.contains('completed')
        };
        tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
