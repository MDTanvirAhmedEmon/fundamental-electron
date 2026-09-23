import './index.css';

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
    document.body.classList.toggle('compact-mode');
});

// openWindow.addEventListener("click", ()=> {
//     window.apiTwoWay.newWindowOpen();
// });

// Screenshots
const trackingButton =
  document.querySelector("#trackingButton");

const trackingStatus =
  document.querySelector("#trackingStatus");

let isTracking = false;

trackingButton.addEventListener(
  "click",
  async () => {

    if (!isTracking) {

      // START
      const result =
        await window.electronAPI.startTracking();

      console.log(
        "START RESULT:",
        result
      );

      if (result.success) {
        isTracking = true;

        // Change ▶ to ⏸
        trackingButton.textContent = "⏸";

        trackingStatus.textContent =
          "Tracking...";
      }

    } else {

      // STOP
      const result =
        await window.electronAPI.stopTracking();

      console.log(
        "STOP RESULT:",
        result
      );

      if (result.success) {
        isTracking = false;

        // Change ⏸ back to ▶
        trackingButton.textContent = "▶";

        trackingStatus.textContent =
          `Stopped — ${result.durationMinutes} minutes, ${result.screenshots.length} screenshots`;
      }
    }
  }
);