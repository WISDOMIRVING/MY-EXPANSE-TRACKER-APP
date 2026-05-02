// Sovereign Ledger — Electron Main Process (Desktop Shell)
const { app, BrowserWindow, Menu, globalShortcut, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Sovereign Ledger',
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'default',
    backgroundColor: '#FFFFFF',
    show: false,
  });

  // Load the Expo web build
  const distPath = path.join(__dirname, '../dist/index.html');
  mainWindow.loadFile(distPath).catch(() => {
    // Fallback: load from dev server if dist doesn't exist
    mainWindow.loadURL('http://localhost:8081');
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Build application menu
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Transaction',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("app-shortcut", { detail: "newTransaction" }))'),
        },
        {
          label: 'Export Data',
          accelerator: 'CmdOrCtrl+E',
          click: () => mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("app-shortcut", { detail: "export" }))'),
        },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+D',
          click: () => mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("app-shortcut", { detail: "dashboard" }))'),
        },
        {
          label: 'Budgets',
          accelerator: 'CmdOrCtrl+B',
          click: () => mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("app-shortcut", { detail: "budgets" }))'),
        },
        {
          label: 'Insights',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("app-shortcut", { detail: "insights" }))'),
        },
        { type: 'separator' },
        {
          label: 'Toggle Dark Mode',
          accelerator: 'CmdOrCtrl+T',
          click: () => mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("app-shortcut", { detail: "toggleTheme" }))'),
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Keyboard Shortcuts',
          accelerator: 'CmdOrCtrl+/',
          click: () => mainWindow.webContents.executeJavaScript('window.dispatchEvent(new CustomEvent("app-shortcut", { detail: "shortcuts" }))'),
        },
        { type: 'separator' },
        {
          label: 'About Sovereign Ledger',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Sovereign Ledger',
              message: 'Sovereign Ledger v2.0.0',
              detail: 'A premium cross-platform expense tracker.\nBuilt with React Native + Expo + Electron.',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
