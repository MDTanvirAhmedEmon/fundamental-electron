import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { captureScreenshot } from "./utils/helpers";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}
let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    width: 320,
    height: 550,
    maxWidth: 320,
    maxHeight: 550,
    // transparent: true,
    resizable: false,
    frame: false,
    icon: path.join(app.getAppPath(), "src", "tracker_logo.ico"),
    // icon: "/src/tracker_logo.ico",
  });

  // send into preload
  // mainWindow.webContents.on('did-finish-load', () => {
  //   mainWindow.webContents.send("fromMain", "This is from main process");
  // });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // receiving from preload
  // ipcMain.on('fromPreload', (event, data) => {
  //   console.log(data)
  // })

  // // receiving from preload two way
  // ipcMain.handle('fromPreloadTwoWay', (event, data) => {
  //   console.log(data)
  //   return "Sending back";
  // })

  ipcMain.handle("app-minimize", () => {
    mainWindow.minimize();
  });

  ipcMain.handle("close", () => {
    app.exit();
  });

  let isCompact = false;

  ipcMain.handle("toggle-size", () => {
    if (!mainWindow) return;

    const [x, y] = mainWindow.getPosition();

    if (!isCompact) {
      mainWindow.setBounds({ x, y, width: 320, height: 330 });
      isCompact = true;
    } else {
      mainWindow.setBounds({ x, y, width: 320, height: 550 });
      isCompact = false;
    }
  });

  // ipcMain.handle("new-window", () => {
  //   const childWindow = new BrowserWindow({
  //     parent: mainWindow,
  //     modal: true,
  //   });
  //   childWindow.loadURL("https://google.com");
  // });




  // screenshots
  ipcMain.handle("take-screenshot", async () => {
    return await captureScreenshot();
  });

  // start taking screenshots
  let tracking = false;
  let trackingInterval = null;
  let trackingStartTime = null;
  let screenshots = [];

  ipcMain.handle("start-tracking", async () => {
    if (tracking) {
      return {
        success: false,
        message: "Tracking is already running",
      };
    }

    tracking = true;
    trackingStartTime = new Date();
    screenshots = [];

    console.log("=================================");
    console.log("TRACKING STARTED");
    console.log("START TIME:", trackingStartTime);
    console.log("=================================");

    trackingInterval = setInterval(async () => {
      try {
        const screenshot = await captureScreenshot();
        screenshots.push(screenshot);
        console.log("Screenshot count:", screenshots.length);
      } catch (error) {
        console.error("Screenshot failed:", error);
      }
    }, 60 * 1000);

    return {
      success: true,
      startedAt: trackingStartTime.toISOString(),
    };
  });

  // stop taking screenshots
  ipcMain.handle("stop-tracking", async () => {
    if (!tracking) {
      return {
        success: false,
        message: "Tracking is not running",
      };
    }

    // Stop the repeating timer
    clearInterval(trackingInterval);
    trackingInterval = null;
    tracking = false;

    // Get stop time
    const trackingEndTime = new Date();
    // Calculate duration
    const durationMs = trackingEndTime.getTime() - trackingStartTime.getTime();
    const durationSeconds = Math.floor(durationMs / 1000);
    const durationMinutes = Math.floor(durationSeconds / 60);

    console.log("=================================");
    console.log("TRACKING STOPPED");
    console.log("START:", trackingStartTime);
    console.log("END:", trackingEndTime);
    console.log("DURATION:", durationMinutes, "minutes");
    console.log("SCREENSHOTS:", screenshots.length);
    console.log("=================================");

    return {
      success: true,
      startedAt: trackingStartTime.toISOString(),
      stoppedAt: trackingEndTime.toISOString(),
      durationSeconds,
      durationMinutes,
      screenshots,
    };
  });



  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// const menuTemplate = [
//   {
//     label: "File",
//     submenu: [
//       {
//         label: "Open",
//         click: async () => {
//           console.log("Clicked");
//           const data = await dialog.showOpenDialog();
//           console.log(data);
//         },
//       },
//       {
//         label: "Open New",
//       },
//     ],
//   },
//   {
//     label: "Insert",
//   },
//   {
//     label: "Edit",
//   },
//   {
//     label: "New File",
//   },
//   {
//     label: "Save",
//   },
// ];

// const appMenu = Menu.buildFromTemplate(menuTemplate);
// Menu.setApplicationMenu(appMenu);
