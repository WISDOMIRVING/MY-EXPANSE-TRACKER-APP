// Sovereign Ledger — Electron Preload Script
const { contextBridge } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  version: '2.0.0',
});
