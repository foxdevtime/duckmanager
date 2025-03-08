const { ipcRenderer } = require('electron');

let project;
const urlParams = new URLSearchParams(window.location.search);
const projectId = parseInt(urlParams.get('id'));

ipcRenderer.on('project-data', (event, proj) => {
    project = proj;
    document.getElementById('projectTitle').textContent = project.name;
    loadContent();
});

document.getElementById('backBtn').addEventListener('click', () => {
    ipcRenderer.send('open-main-window'); // Сообщаем основному процессу открыть главное окно
});

function loadContent() {
    const content = document.getElementById('taskContent');
    content.innerHTML = '';

    // Если контента нет, создаём начальный блок "Duck Day"
    if (!project.content || project.content.length === 0) {
        addTaskManager(true);
    } else {
        project.content.forEach(block => {
            const taskManager = document.createElement('div');
            taskManager.className = 'task-manager';
            taskManager.innerHTML = `
                <h3 contenteditable="true">${block.title}</h3>
                ${block.tasks.map(task => `
                    <div class="task-item">
                        <input type="checkbox" ${task.completed ? 'checked' : ''}>
                        <span contenteditable="true">${task.text}</span>
                        <button class="delete-task-btn" title="Удалить задачу">✕</button>
                    </div>
                `).join('')}
                <button class="add-task-btn" title="Добавить задачу"><svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="#889BBEFF"></path> </g></svg></button>
                <button class="delete-btn" title="Удалить блок"><svg style="width: 20px; height: 20px;" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#ee5353" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
            `;
            setupTaskManager(taskManager);
            content.appendChild(taskManager);
        });
    }

    document.querySelector('.add-manager-btn').addEventListener('click', () => addTaskManager(false));
    saveContent(); // Сохраняем сразу после загрузки
}

function addTaskManager(isInitial = false) {
    const content = document.getElementById('taskContent');
    const taskManager = document.createElement('div');
    taskManager.className = 'task-manager';

    if (isInitial) {
        taskManager.innerHTML = `
            <h3 contenteditable="true">Duck Day</h3>
            <div class="task-item">
                <input type="checkbox">
                <span contenteditable="true">Quack</span>
                <button class="delete-task-btn" title="Удалить задачу">✕</button>
            </div>
            <div class="task-item">
                <input type="checkbox">
                <span contenteditable="true">Quack-Quack</span>
                <button class="delete-task-btn" title="Удалить задачу">✕</button>
            </div>
            <div class="task-item">
                <input type="checkbox">
                <span contenteditable="true">Quack-Quack-Quack</span>
                <button class="delete-task-btn" title="Удалить задачу">✕</button>
            </div>
            <button class="add-task-btn" title="Добавить задачу"><svg style="width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="#889BBEFF"></path> </g></svg></button>
            <button class="delete-btn" title="Удалить блок"><svg style="width: 20px; height: 20px;" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#ee5353" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
        `;
    } else {
        taskManager.innerHTML = `
            <h3 contenteditable="true">Quack ;3</h3>
            <div class="task-item">
                <input type="checkbox">
                <span contenteditable="true">???</span>
                <button class="delete-task-btn" title="Удалить задачу">✕</button>
            </div>
            <button class="add-task-btn" title="Добавить задачу"><svg style="width: 26px; height: 26px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" fill="#889BBEFF"></path> </g></svg></button>
            <button class="delete-btn" title="Удалить блок"><svg style="width: 20px; height: 20px;" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#ee5353" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
        `;
    }

    setupTaskManager(taskManager);
    content.appendChild(taskManager);
    saveContent();
}

function setupTaskManager(taskManager) {
    taskManager.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', toggleTask);
    });

    taskManager.querySelector('.add-task-btn').addEventListener('click', () => addNewTask(taskManager));
    taskManager.querySelectorAll('.delete-task-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.parentElement.remove();
            saveContent();
        });
    });
    taskManager.querySelector('.delete-btn').addEventListener('click', () => {
        taskManager.remove();
        saveContent();
    });

    taskManager.querySelector('h3').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') e.preventDefault();
    });
    taskManager.querySelector('h3').addEventListener('input', saveContent);
    taskManager.querySelectorAll('span').forEach(span => {
        span.addEventListener('input', saveContent);
    });
}

function toggleTask(e) {
    const taskItem = e.target.parentElement;
    if (e.target.checked) {
        taskItem.classList.add('completed');
    } else {
        taskItem.classList.remove('completed');
    }
    saveContent();
}

function addNewTask(taskManager) {
    const newTask = document.createElement('div');
    newTask.className = 'task-item';
    newTask.innerHTML = `
        <input type="checkbox">
        <span contenteditable="true">-</span>
        <button class="delete-task-btn" title="Удалить задачу">✕</button>
    `;
    newTask.querySelector('input[type="checkbox"]').addEventListener('change', toggleTask);
    newTask.querySelector('.delete-task-btn').addEventListener('click', (e) => {
        e.target.parentElement.remove();
        saveContent();
    });
    newTask.querySelector('span').addEventListener('input', saveContent);

    const addBtn = taskManager.querySelector('.add-task-btn');
    taskManager.insertBefore(newTask, addBtn);
    newTask.querySelector('span').focus();
    saveContent();
}

function saveContent() {
    const content = [];
    document.querySelectorAll('.task-manager').forEach(manager => {
        const title = manager.querySelector('h3').textContent;
        const tasks = [];
        manager.querySelectorAll('.task-item').forEach(item => {
            tasks.push({
                text: item.querySelector('span').textContent,
                completed: item.querySelector('input[type="checkbox"]').checked
            });
        });
        content.push({ title, tasks });
    });
    ipcRenderer.send('save-project-content', projectId, content);
}

document.addEventListener('DOMContentLoaded', () => {
    // Загрузка начнётся после получения данных через IPC
});