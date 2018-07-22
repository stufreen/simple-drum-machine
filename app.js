const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function triggerMouseEvent (node, eventType) {
   const event = new MouseEvent(eventType, {
    view: window,
    bubbles: true,
    cancelable: true
  });
  node.dispatchEvent(event);
}

function fakeClick(target) {
  triggerMouseEvent (target, "mousedown");
  triggerMouseEvent (target, "mouseup");
  triggerMouseEvent (target, "click");
}

function fetchFile(url) {
  return new Promise((resolve, reject) => {
    fetch(url).then((response) => {
      if(response.ok) {
        resolve(response.blob());
      }
      reject(new Error('Network response was not ok.'));
    })
  })
}

function decodeFile(sampleBlob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    const soundBuffer = fileReader.readAsArrayBuffer(sampleBlob);
    fileReader.onloadend = (e) => {
      resolve(fileReader.result);
    };
  });
}

function decodeAudio(audioArrayBuffer) {
  return new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(audioArrayBuffer, resolve, reject);
  });
}

function playAudio(myArrayBuffer) {
  const source = audioCtx.createBufferSource();
  source.buffer = myArrayBuffer;
  source.connect(audioCtx.destination);
  source.start();
}

function setupDrumButton(url, id, keyCode) {
  fetchFile(url)
    .then(decodeFile)
    .then(decodeAudio)
    .then((drumArrayBuffer) => {
      // Button listener
      const button = document.getElementById(id);
      button.addEventListener('mousedown', () => {
        playAudio(drumArrayBuffer);
      });

      // Keyboard listener
      if (typeof keyCode === "number") {

        window.addEventListener('keydown', (e) => {
          if (event.keyCode === keyCode) {
            triggerMouseEvent (button, "mousedown");
            button.classList.add('active');
          }
        });

        window.addEventListener('keyup', (e) => {
          if (event.keyCode === keyCode) {
            triggerMouseEvent (button, "mouseup");
            triggerMouseEvent (button, "click");
            button.classList.remove('active');
          }
        });
      }
    });
}

(function main() {
  setupDrumButton('./drums/snare.wav', 'snare', 72);
  setupDrumButton('./drums/high.wav', 'high', 71);
  setupDrumButton('./drums/low.wav', 'low', 70);
})();