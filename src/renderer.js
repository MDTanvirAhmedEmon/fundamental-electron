import './index.css';

// const button = document.querySelector(".btn");
// const sendMainBtn = document.querySelector(".sendMainBtn");
// const twoWayBtn = document.querySelector(".twoWayBtn");
const appClose = document.querySelector("#app-close");
const restoreDown = document.querySelector("#restore-down");
const appMinimize = document.querySelector("#app-minimize");

// button.addEventListener("click", () => {
//   console.log(test);
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