import { volume, freqLeft, freqRight } from "./store";
import { get } from "svelte/store";

var context = new AudioContext();

//function that generates a 100hz tone
function generateOscillator(freq) {
  var oscillator = context.createOscillator();
  var gainNode = context.createGain();
  oscillator.frequency.value = freq;
  return oscillator;
}

function BinauralBeats() {
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
}

export default BinauralBeats;
