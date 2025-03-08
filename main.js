const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWindow;
let projectWindow;
let projects = [];
const dataDir = path.join(os.homedir(), '.local', 'share', '.duckmanager');
const dataFile = path.join(dataDir, 'projects.json');

// Создаём директорию, если её нет
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Загружаем проекты из файла или инициализируем пустой массив
function loadProjects() {
    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile, 'utf8');
        projects = JSON.parse(data);
    } else {
        projects = [];
    }
}

// Сохраняем проекты в файл
function saveProjects() {
    fs.writeFileSync(dataFile, JSON.stringify(projects, null, 2));
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        minWidth: 500,
        minHeight: 400,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadFile('index.html');
    mainWindow.setMinimumSize(500, 400);
    // mainWindow.webContents.openDevTools(); // Для отладки
}

function createProjectWindow(projectId) {
    projectWindow = new BrowserWindow({
        width: 900,
        height: 600,
        minWidth: 520,
        minHeight: 400,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    projectWindow.loadFile('project.html', { query: { id: projectId } });
    projectWindow.webContents.on('did-finish-load', () => {
        const project = projects.find(p => p.id === parseInt(projectId));
        projectWindow.webContents.send('project-data', project);
    });
    mainWindow.close();
    mainWindow = null;
}

const createMenu = () => {
    const template = [
        {
            label: 'Duck',
            submenu: [
                {
                    label: 'Themes',
                    submenu: [
                        { label: 'Light', enabled: false }, // Заблокировано
                        { label: 'Dark', enabled: false },
                        { label: 'Duck Yellow', enabled: false }
                    ]
                },
                { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
            ]
        },
        {
            label: 'Tasks',
            submenu: [
                {
                    label: 'Open Project Folder',
                    click: () => shell.openPath(dataDir) // Открывает папку с projects.json
                },
                { label: 'Refresh', accelerator: 'F5', click: () => mainWindow.webContents.send('refresh-projects') }
            ]
        },
        {
            label: 'Settings',
            submenu: [
                { label: 'Preferences', click: () => console.log('Открыть настройки (не реализовано)') },
                { type: 'separator' },
                {
                    label: 'About DuckManager',
                    click: () => shell.openExternal('https://github.com/foxdevtime/duckmanager') // Переход на GitHub
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};

app.whenReady().then(() => {
    loadProjects();
    createMainWindow();
    createMenu();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// IPC для работы с проектами
ipcMain.on('open-project', (event, projectId) => {
    createProjectWindow(projectId);
});

ipcMain.on('get-projects', (event) => {
    event.reply('projects-data', projects);
});

ipcMain.on('save-projects', (event, updatedProjects) => {
    projects = updatedProjects;
    saveProjects();
});

ipcMain.on('save-project-content', (event, projectId, content) => {
    const project = projects.find(p => p.id === parseInt(projectId));
    if (project) {
        project.content = content; // Сохраняем содержимое проекта
        saveProjects();
    }
});

ipcMain.on('open-main-window', () => {
    if (!mainWindow) {
        projectWindow.close();
        projectWindow = null;
        createMainWindow();
    }
});