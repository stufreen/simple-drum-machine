const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

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
			if (typeof id !== "undefined") {
				const button = document.getElementById(id);
				button.addEventListener('mousedown', () => {
					playAudio(drumArrayBuffer);
				});
			}
			// Keyboard listener
			if (typeof keyCode === "number") {
				window.addEventListener('keydown', (e) => {
					if (event.keyCode === keyCode) {
						playAudio(drumArrayBuffer);
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