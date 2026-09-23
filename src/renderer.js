import "./index.css";
import { formatTime } from "./utils/RendererHelpers";

// const button = document.querySelector(".btn");
// const sendMainBtn = document.querySelector(".sendMainBtn");
// const twoWayBtn = document.querySelector(".twoWayBtn");
const appClose = document.querySelector("#app-close");
const restoreDown = document.querySelector("#restore-down");
const appMinimize = document.querySelector("#app-minimize");
// const openWindow = document.querySelector("#open-window");

// button.addEventListener("click", () => {
//   console.log(window.test);
// });

// // received with call back
// // window.api.onFromMain((data) => {
// //   console.log("Received:", data);
// // });

// sendMainBtn.addEventListener("click", () => {
//     window.api.SendToMain();
// });

// twoWayBtn.addEventListener("click", () => {
//     window.apiTwoWay.SendToMainTwoWay();
// });

appClose.addEventListener("click", () => {
  window.apiTwoWay.closeTheApp();
});

appMinimize.addEventListener("click", () => {
  window.apiTwoWay.minimizeTheApp();
});

restoreDown.addEventListener("click", () => {
  window.apiTwoWay.toggleSize();
  document.body.classList.toggle("compact-mode");
});

// openWindow.addEventListener("click", ()=> {
//     window.apiTwoWay.newWindowOpen();
// });

// Screenshots
const trackingButton = document.querySelector("#trackingButton");
const trackingStatus = document.querySelector("#trackingStatus");
const timerElement = document.querySelector("#timer");

let isTracking = false;

// timer for Ui
let timerInterval = null;
let timerStartTime = null;

function startTimer() {
  timerStartTime = Date.now();

  timerInterval = setInterval(() => {
    const elapsedMs =
      Date.now() - timerStartTime;

    const elapsedSeconds =
      Math.floor(elapsedMs / 1000);

    timerElement.textContent =
      formatTime(elapsedSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerStartTime = null;
}

trackingButton.addEventListener("click", async () => {
  if (!isTracking) {
    // START
    const result = await window.electronAPI.startTracking();

    console.log("START RESULT:", result);

    if (result.success) {
      isTracking = true;

      // Change ▶ to ⏸
      trackingButton.textContent = "⏸";
      trackingButton.classList.add("tracking");
      trackingStatus.textContent = "Tracking...";
      startTimer();
    }
  } else {
    // STOP
    const result = await window.electronAPI.stopTracking();

    console.log("STOP RESULT:", result);

    if (result.success) {
      isTracking = false;

      // Change ⏸ back to ▶
      trackingButton.textContent = "▶";
      trackingButton.classList.remove("tracking");

      trackingStatus.textContent = `Stopped — ${result.durationMinutes} minutes, ${result.screenshots.length} screenshots`;
      stopTimer();
    }
  }
});
