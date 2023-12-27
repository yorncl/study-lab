import { volume, freqLeft, freqRight } from "./store";
import { get } from "svelte/store";

let context = null;
let gainNode = null;

//function that generates a 100hz tone
function generateOscillator(freq) {
  let oscillator = context.createOscillator();
  gainNode = context.createGain();
  oscillator.frequency.value = freq;
  return oscillator;
}

function BinauralBeats() {
  context = new AudioContext();
  this.osc1 = generateOscillator(get(freqLeft));
  this.osc2 = generateOscillator(get(freqRight));
  // subscribe for change in frequences
  freqLeft.subscribe((value) => {
    this.osc1.frequency.value = value;
  });
  freqRight.subscribe((value) => {
    this.osc2.frequency.value = value;
  });
  this.panner1 = context.createStereoPanner();
  this.panner2 = context.createStereoPanner();
  //panner1 to left
  this.panner1.pan.value = -1;
  // panner2 to right
  this.panner2.pan.value = 1;
  this.gainNode = context.createGain();
  this.gainNode.gain.value = get(volume);
  this.osc1.connect(this.panner1);
  this.osc2.connect(this.panner2);
  //connect panners
  this.panner1.connect(this.gainNode);
  this.panner2.connect(this.gainNode);
  this.gainNode.connect(context.destination);

  this.setVolume = function (vol) {
    this.gainNode.gain.value = vol;
  };

  this.start = function () {
    this.osc1.start(0);
    this.osc2.start(0);
  };
  this.stop = function () {
    // check if running and stop if it is
    this.osc1.stop(0);
    this.osc2.stop(0);
  };

  this.playBell = function () // TODO move this is gross
  {
    // Create an AudioBufferSourceNode
    const sourceNode = context.createBufferSource();

    // Load an audio file (replace 'sound.wav' with your audio file)
    const audioFile = "bell.mp3";
    fetch(audioFile) // TODO fetching everytime is ugly af but it's midnight and I'm tired, move somewhere better
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        // Assign the audio buffer to the source node
        sourceNode.buffer = audioBuffer;

        // Connect the source node to the gain node
        sourceNode.connect(this.gainNode);

        // Start playing the sound
        sourceNode.start();
      })
      .catch((error) => {
        console.error("Error loading audio file:", error);
      });
  };
}

export default BinauralBeats;
