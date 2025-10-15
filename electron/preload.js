const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  createFolders: (mandatData) => ipcRenderer.invoke('create-folders', mandatData)
});