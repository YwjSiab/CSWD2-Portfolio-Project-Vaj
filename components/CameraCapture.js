// components/CameraCapture.js
class CameraCapture extends HTMLElement {
  #stream = null;

  connectedCallback() {
    // configurable input name (defaults to "photoDataUrl")
    const inputName = this.getAttribute("input-name") || "photoDataUrl";
    const shutterSrc = this.getAttribute("shutter-src") || "shutter.mp3";

    this.innerHTML = `
      <div class="camera-capture">
        <div class="camera-row">
          <video autoplay playsinline muted></video>
          <canvas aria-label="snapshot" hidden></canvas>
        </div>

        <div class="camera-controls">
          <button type="button" id="startBtn">Start Camera</button>
          <button type="button" id="snapBtn" disabled>Take Photo</button>
          <button type="button" id="retakeBtn" disabled>Retake</button>
          <button type="button" id="stopBtn" disabled>Stop</button>
        </div>

        <div class="camera-preview">
          <img id="preview" alt="Your snapshot will appear here" />
        </div>

        <input type="hidden" name="${inputName}" id="${inputName}" />
        <audio id="shutter" preload="auto" src="${shutterSrc}"></audio>

        <p id="camMsg" class="cam-msg" role="status"></p>
      </div>
    `;

    // elements
    this.$ = {
      video: this.querySelector("video"),
      canvas: this.querySelector("canvas"),
      start:  this.querySelector("#startBtn"),
      snap:   this.querySelector("#snapBtn"),
      retake: this.querySelector("#retakeBtn"),
      stop:   this.querySelector("#stopBtn"),
      preview:this.querySelector("#preview"),
      hidden: this.querySelector(`input[type=hidden]`),
      msg:    this.querySelector("#camMsg"),
      shutter:this.querySelector("#shutter"),
    };

    // events
    this.$.start.addEventListener("click", () => this.start());
    this.$.snap.addEventListener("click",  () => this.snap());
    this.$.retake.addEventListener("click",() => this.retake());
    this.$.stop.addEventListener("click",  () => this.stop());

    // if permissions already granted, auto-start
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "camera" }).then((p) => {
        if (p.state === "granted") this.start();
      }).catch(()=>{ /* ignore */ });
    }
  }

  async start() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        this.note("Camera not supported in this browser.");
        return;
      }
      this.note("Starting camera…");
      this.#stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      this.$.video.srcObject = this.#stream;
      this.$.snap.disabled = false;
      this.$.stop.disabled = false;
      this.$.retake.disabled = true;
      this.$.canvas.hidden = true;
      this.note("Camera ready.");
    } catch (err) {
      this.note("Camera error: " + (err?.message || err));
    }
  }

  snap() {
    try {
      if (!this.#stream) return;
      const vw = this.$.video.videoWidth || 640;
      const vh = this.$.video.videoHeight || 480;

      // draw frame
      this.$.canvas.width = vw;
      this.$.canvas.height = vh;
      const ctx = this.$.canvas.getContext("2d");
      ctx.drawImage(this.$.video, 0, 0, vw, vh);

      // encode (quality ~0.9 jpeg)
      const dataUrl = this.$.canvas.toDataURL("image/jpeg", 0.9);

      // store + preview
      this.$.hidden.value = dataUrl;
      this.$.preview.src = dataUrl;

      // sound (optional)
      this.$.shutter.currentTime = 0;
      this.$.shutter.play().catch(()=>{ /* ignore */ });

      // toggle buttons
      this.$.retake.disabled = false;
      this.$.snap.disabled = true;

      // simple ~1.5MB guard
      const approxBytes = Math.ceil((dataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
      if (approxBytes > 1_500_000) {
        this.note("Snapshot is large (~" + Math.round(approxBytes/1024) + " KB). Consider retaking.");
      } else {
        this.note("Photo captured.");
      }
    } catch (err) {
      this.note("Snap failed: " + (err?.message || err));
    }
  }

  retake() {
    this.$.hidden.value = "";
    this.$.preview.removeAttribute("src");
    this.$.snap.disabled = false;
    this.$.retake.disabled = true;
    this.note("Ready to retake.");
  }

  stop() {
    try {
      this.#stream?.getTracks().forEach(t => t.stop());
      this.#stream = null;
      this.$.video.srcObject = null;
      this.$.snap.disabled = true;
      this.$.stop.disabled = true;
      this.$.retake.disabled = true;
      this.note("Camera stopped.");
    } catch (err) {
      this.note("Stop failed.");
    }
  }

  note(text) {
    this.$.msg.textContent = text;
  }
}

customElements.define("camera-capture", CameraCapture);
