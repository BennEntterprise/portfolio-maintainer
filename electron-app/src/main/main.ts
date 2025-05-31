import { app, BrowserWindow } from "electron";
import path from "path";

// Start Express server
import "../server/api";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load React app (assumes built files in /public)
  win.loadFile(path.join(__dirname, "../../dist/renderer/index.html"));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
