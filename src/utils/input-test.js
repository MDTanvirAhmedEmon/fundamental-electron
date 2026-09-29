import { uIOhook } from "uiohook-napi";

export class InputTest {
  constructor() {
    this.setupListeners();
  }

  setupListeners() {
    // Mouse click
    uIOhook.on("mousedown", () => {
      console.log("🖱️ Mouse clicked");
    });

    // Keyboard press
    uIOhook.on("keydown", (event) => {
      console.log(
        "⌨️ Keyboard pressed:",
        event.keycode
      );
    });
  }

  start() {
    console.log("Starting uIOhook...");

    uIOhook.start();

    console.log("uIOhook is running");
  }

  stop() {
    console.log("Stopping uIOhook...");

    uIOhook.stop();

    console.log("uIOhook stopped");
  }
}