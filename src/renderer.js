import './index.css';

const button = document.querySelector(".btn");
const sendMainBtn = document.querySelector(".sendMainBtn");
const twoWayBtn = document.querySelector(".twoWayBtn");

button.addEventListener("click", () => {
  console.log(test);
});

sendMainBtn.addEventListener("click", () => {
    window.api.SendToMain();
});

twoWayBtn.addEventListener("click", () => {
    window.apiTwoWay.SendToMainTwoWay();
});