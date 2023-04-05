/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("environment", {
  isProd: () => ipcRenderer.invoke("isProd"),
});
