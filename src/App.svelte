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
  import { faGithub } from "@fortawesome/free-brands-svg-icons";
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
  <div class="fixed top-0 left-0 w-full ">
    <div class="flex w-full justify-center">
      <div class="navbar w-1/2">
        <div class="flex-1">
          <a class="btn btn-ghost normal-case text-2xl">Yorn's study lab</a>
        </div>
        <div class="flex-none text-4xl" id="menuitems">
          <label for="settings-modal">
            <div alt="Settings">
              <Fa icon={faGear} />
            </div>
          </label>
          <label for="info-modal">
            <div alt="Info">
              <Fa icon={faInfoCircle} />
            </div>
          </label>
          <a href="https://github.com/yorncl/study-lab">
            <div alt="Github">
              <Fa icon={faGithub} />
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
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

  <!-- Put this part before </body> tag -->
  <input type="checkbox" id="settings-modal" class="modal-toggle" />
  <label for="settings-modal" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
      <h3 class="text-lg font-bold">Congratulations random Internet user!</h3>
      <p class="py-4">
        You've been selected for a chance to get one year of subscription to use
        Wikipedia for free!
      </p>
    </label>
  </label>
  <input type="checkbox" id="info-modal" class="modal-toggle" />
  <label for="info-modal" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
      <h3 class="text-lg font-bold">Info</h3>
      <p class="py-4">
        This app is based on the information from the Huberman Lab's newsletter
      </p>
      <ul>
        <li>
          <a
            href="https://hubermanlab.com/teach-and-learn-better-with-a-neuroplasticity-super-protocol/
"
            >Neuroplasticity protocol
          </a>
        </li>
        <li>https://www.hubermanlab.com/brainwave-entrainment/</li>
      </ul>
    </label>
  </label>
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

  #menuitems > * {
    background-color: rgba(0, 0, 0, 0.5);
    @apply block ml-3 p-2 rounded-lg cursor-pointer;
  }

  #timer {
    font-size: 3em;
    font-weight: 100;
  }

  #controls {
    margin-top: 0.4em;
    font-size: 2em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
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
