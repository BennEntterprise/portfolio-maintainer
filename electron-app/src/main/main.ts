import { app, BrowserWindow } from "electron";
import path from "path";

// Enable live reload for Electron in development
if (process.env.NODE_ENV === "development") {
  require("electron-reload")(__dirname, {
    electron: path.join(
      __dirname,
      "..",
      "..",
      "node_modules",
      ".bin",
      "electron"
    ),
    hardResetMethod: "exit",
  });
}

// Start Express server
import "../server/api";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // In development, load from Vite dev server, otherwise load built files
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    // Open DevTools in development
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../../dist/renderer/index.html"));
  }
}

let windowCreated = false;

app.whenReady().then(() => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// On macOS, re-create a window when the dock icon is clicked and there are no other windows open
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Graceful shutdown for exit signals
function shutdown() {
  // Add any cleanup logic here, such as closing windows or saving state
  console.log("Shutting down Electron main process gracefully...");
  app.quit();
}

process.on("SIGINT", shutdown); // Ctrl+C
process.on("SIGTERM", shutdown); // kill command
process.on("SIGQUIT", shutdown); // quit signal
