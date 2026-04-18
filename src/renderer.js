import './index.css';

const button = document.querySelector(".btn");
const sendMainBtn = document.querySelector(".sendMainBtn");
const twoWayBtn = document.querySelector(".twoWayBtn");

button.addEventListener("click", () => {
  console.log(test);
});

// received with call back
// window.api.onFromMain((data) => {
//   console.log("Received:", data);
// });

sendMainBtn.addEventListener("click", () => {
    window.api.SendToMain();
});

twoWayBtn.addEventListener("click", () => {
    window.apiTwoWay.SendToMainTwoWay();
});