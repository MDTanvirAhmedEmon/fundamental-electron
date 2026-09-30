import { uIOhook } from "uiohook-napi";

const BIT_MOUSE = 1;
const BIT_KEYBOARD = 2;
const MAX_WINDOW_SECONDS = 60 * 60;
const MOUSEMOVE_THROTTLE_MS = 500;

export class InputTracker {
  constructor() {
    this.handlersBound = false;
    this.activityBits = new Uint8Array(
      MAX_WINDOW_SECONDS
    );
    this.keysDown = new Set();
    this.keypressCount = 0;
    this.mouseClickCount = 0;
    this.mouseMoveCount = 0;
    this.windowStartedAt = Date.now();
    this.running = false;
    this.lastMouseMoveTs = 0;
    this.setupListeners();
  }

  recordActivity(bit, now) {
    const i = Math.floor(
      (now - this.windowStartedAt) / 1000
    );

    if (i >= 0 && i < MAX_WINDOW_SECONDS) {
      this.activityBits[i] |= bit;
      // this.activityBits[i] =
      //   this.activityBits[i] | bit;
      // becomes:
      // this.activityBits[7] =
      // 0 | 1;
    }
  }

  setupListeners() {
    if (this.handlersBound) {
      return;
    }

    // Mouse movement
    uIOhook.on("mousemove", () => {
      if (!this.running) {
        return;
      }

      const now = Date.now();

      this.mouseMoveCount++;

      if (
        now - this.lastMouseMoveTs >=
        MOUSEMOVE_THROTTLE_MS
      ) {
        this.lastMouseMoveTs = now;

        this.recordActivity(
          BIT_MOUSE,
          now
        );
      }
    });

    // Mouse click
    uIOhook.on("mousedown", () => {
      if (!this.running) {
        return;
      }

      this.mouseClickCount++;

      this.recordActivity(
        BIT_MOUSE,
        Date.now()
      );
    });

    // Keyboard press
    uIOhook.on("keydown", (event) => {
      if (!this.running) {
        return;
      }

      // Prevent key-repeat from being
      // counted as multiple key presses.
      if (this.keysDown.has(event.keycode)) {
        return;
      }

      this.keysDown.add(event.keycode);

      this.keypressCount++;

      this.recordActivity(
        BIT_KEYBOARD,
        Date.now()
      );
    });

    // Keyboard release
    uIOhook.on("keyup", (event) => {
      this.keysDown.delete(event.keycode);
    });

    this.handlersBound = true;

    console.log(
      "Input tracker listeners setup successfully"
    );
  }

  getActivity() {
    const now = Date.now();

    const elapsedSeconds = Math.floor(
      (now - this.windowStartedAt) / 1000
    );

    const windowSeconds = Math.max(
      1,
      Math.min(
        elapsedSeconds,
        MAX_WINDOW_SECONDS
      )
    );

    let totalActiveSeconds = 0;
    let totalMouseSeconds = 0;
    let totalKeyboardSeconds = 0;

    for ( let i = 0; i < windowSeconds; i++ ) {
      const bit = this.activityBits[i];

      if (bit !== 0) {
        totalActiveSeconds++;
      }

      if (bit & BIT_MOUSE) {
        totalMouseSeconds++;
      }

      if (bit & BIT_KEYBOARD) {
        totalKeyboardSeconds++;
      }
    }

    const mouseActivity = Math.round(
      (totalMouseSeconds / windowSeconds) * 100
    );

    const keyboardActivity = Math.round(
      (totalKeyboardSeconds / windowSeconds) * 100
    );

    const score = Math.round(
      (totalActiveSeconds / windowSeconds) * 100
    );

    return {
      snapshot: {
        score,
        mouse_activity: mouseActivity,
        keyboard_activity: keyboardActivity,
        duration: windowSeconds,
      },

      input: {
        mouse_moves: this.mouseMoveCount,
        mouse_clicks: this.mouseClickCount,
        keypresses: this.keypressCount,
      },
    };
  }

  reset() {
    this.activityBits.fill(0);

    this.keypressCount = 0;
    this.mouseClickCount = 0;
    this.mouseMoveCount = 0;

    this.windowStartedAt = Date.now();
  }

  start() {
    if (this.running) {
      return true;
    }

    this.running = true;

    this.windowStartedAt = Date.now();

    try {
      uIOhook.start();

      console.log(
        "Input tracker started successfully"
      );

      return true;
    } catch (error) {
      this.running = false;

      console.error(
        "Input tracker failed to start:",
        error
      );

      return false;
    }
  }

  stop() {
    if (!this.running) {
      return;
    }

    this.running = false;

    try {
      uIOhook.stop();
    } catch (error) {
      console.error(
        "Input tracker stop error:",
        error
      );
    }

    this.reset();

    this.keysDown.clear();

    console.log(
      "Input tracker stopped successfully"
    );
  }
}
