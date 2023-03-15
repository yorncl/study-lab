<script>
  import { writable, get } from "svelte/store";
  import Fa from "svelte-fa";
  import {
    faPause,
    faPlay,
    faRefresh,
    faGear,
    faInfoCircle,
  } from "@fortawesome/free-solid-svg-icons";
  import { volume } from "./store";
  import BinauralBeats from "./audio";

  import VolumeSlider from "./components/VolumeSlider.svelte";

  let bb = new BinauralBeats();
  // update volume on store change
  volume.subscribe((value) => {
    if (bb) bb.setVolume(value);
  });

  let counter = 5400;
  let started = false;
  let paused = false;
  let timer = null;
  function start() {
    bb.start();
    // start a timer
    timer = setInterval(() => {
      if (paused == false) {
        counter--;
      }
      if (counter <= 0) {
        reset();
      }
    }, 1000);
    started = true;
  }
  function pause() {
    bb.stop();
    paused = true;
  }
  function unpause() {
    bb = new BinauralBeats();
    bb.start();
    paused = false;
  }
  function reset() {
    if (bb) bb.stop();
    bb = new BinauralBeats();
    paused = false;
    started = false;
    if (timer) clearInterval(timer);
    timer = null;
    counter = 5400;
  }

  function computeCounterString(value) {
    //compute with zero padding if needed
    let hours = Math.floor(value / 3600);
    let minutes = String(Math.floor((value % 3600) / 60));
    let seconds = String(Math.floor(value % 60));
    if (minutes.length == 1) {
      minutes = "0" + minutes;
    }
    if (seconds.length == 1) {
      seconds = "0" + seconds;
    }
    return hours + ":" + minutes + ":" + seconds;
  }
</script>

<main>
  <div>
    <h1>Study Timer</h1>
    <!-- counter in hours, minutes and seconds -->
    <span id="timer">{computeCounterString(counter)}</span>
  </div>
  <div id="controls">
    {#if started}
      {#if paused}
        <div alt="Unpause" on:click={unpause}>
          <Fa icon={faPlay} />
        </div>
      {:else}
        <div alt="Pause" on:click={pause}>
          <Fa icon={faPause} />
        </div>
      {/if}
      <div alt="Reset" on:click={reset}>
        <Fa icon={faRefresh} />
      </div>
    {:else}
      <div on:click={start}>Start</div>
    {/if}
    <VolumeSlider />
  </div>
  <div id="settings">
    <div alt="Settings" on:click={reset}>
      <Fa icon={faGear} />
    </div>
    <div alt="Info" on:click={reset}>
      <Fa icon={faInfoCircle} />
    </div>
  </div>
  {$volume}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  #timer {
    font-size: 3em;
    font-weight: 100;
  }

  #controls,
  #settings {
    margin-top: 0.4em;
    font-size: 2em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  #controls > div,
  #settings > div {
    cursor: pointer;
    margin: 0 0.5em;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 20px;
    min-width: 30px;
    border-radius: 15px;
  }

  h1 {
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
