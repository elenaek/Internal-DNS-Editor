// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 750,
    title: "Internal DNS Editor"
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  const menuTemplate = [
    {
      id: "DNS",
      label: "DNS Records",
      enabled: false,
      submenu: [
        {
          id: "add-record",
          label: "Add Record",
          accelerator: "CommandOrControl+N",
          click() {
            mainWindow.webContents.send("add-record");
          }
        },
        {
          label: "Refresh List",
          accelerator: "CommandOrControl+R",
          click() {
            mainWindow.webContents.send("refresh-records");
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteandmatchstyle" },
        { role: "selectall" }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          id: "contact",
          label: "Contact",
          click() {
            mainWindow.webContents.send("contact");
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  ipcMain.on("activate-menu", () => {
    //enableAddRecord(menu);
    enableDNSMenu(menu);
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("close-app", function() {
  app.quit();
});

app.on("activate", function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const enableDNSMenu = menu => {
  menu.getMenuItemById("DNS").enabled = true;
};
