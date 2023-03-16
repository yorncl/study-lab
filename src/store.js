import { writable } from "svelte/store";

let volume = writable(0.1);
let muted = writable(false);

let freqLeft = writable(100);
let freqRight = writable(140);

export { volume, muted, freqLeft, freqRight };
