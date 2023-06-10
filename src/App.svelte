<script>
  import { writable, get } from "svelte/store";
  import Fa from "svelte-fa";
  import {
    faPause,
    faPlay,
    faRefresh,
    faGear,
    faInfoCircle,
    faVolumeMute,
    faVolumeLow,
    faVolumeHigh,
  } from "@fortawesome/free-solid-svg-icons";
  import { faGithub } from "@fortawesome/free-brands-svg-icons";
  import { volume } from "./store";
  import BinauralBeats from "./audio";
  import Timer from "./components/Timer.svelte";

  let bb = new BinauralBeats();
  // update volume on store change
  volume.subscribe((value) => {
    if (bb) bb.setVolume(value);
  });

  let counter = 5400;
  let started = false;
  let paused = false;
  let timer = null;

  // create a timeout that fires every two minutes on average

  function playBellSound() {
    bb.playBell();
  }

  let randomTimer = null;
  function createRandomTimeout() {
    let u = 1 - Math.random();
    let v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    let seconds = z * 15 + 120;
    randomTimer = setTimeout(() => {
      playBellSound();
      createRandomTimeout();
    }, seconds * 1000);
  }
  function enableRandomTimer() {
    createRandomTimeout();
  }
  function disableRandomTimer() {
    clearTimeout(randomTimer);
  }

  function start() {
    enableRandomTimer();
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
    disableRandomTimer();
    bb.stop();
    paused = true;
  }
  function unpause() {
    enableRandomTimer();
    bb = new BinauralBeats();
    bb.start();
    paused = false;
  }
  function reset() {
    disableRandomTimer();
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

  let volInput = $volume * 100;

  function toggleMute() {}
</script>

<main>
  <div class="fixed top-0 left-0 w-full">
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
    <!-- <Timer /> -->
  </div>
  <div class="flex flex-col items-center">
    <div>
      {#if started}
        {#if paused}
          <div class="btn" on:click={unpause} on:keydown={unpause}>
            <Fa icon={faPlay} />
          </div>
        {:else}
          <div class="btn" on:click={pause} on:keydown={pause}>
            <Fa icon={faPause} />
          </div>
        {/if}
        <div class="btn" on:click={reset} on:keydown={reset}>
          <Fa icon={faRefresh} />
        </div>
      {:else}
        <div class="btn" on:click={start} on:keydown={start}>Start</div>
      {/if}
    </div>
    <div class="flex flex-row items-center">
      <div class="btn btn-square" on:click={toggleMute} on:keydown={toggleMute}>
        {#if $volume == 0}
          <Fa icon={faVolumeMute} />
        {:else if $volume < 0.5}
          <Fa icon={faVolumeLow} />
        {:else}
          <Fa icon={faVolumeHigh} />
        {/if}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        bind:value={volInput}
        class="ml-3 range range-primary"
        on:input={() => {
          volume.set(volInput / 100);
        }}
      />
    </div>
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
            >https://hubermanlab.com/teach-and-learn-better-with-a-neuroplasticity-super-protocol/
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
    @apply rounded-lg cursor-pointer text-3xl ml-3 btn btn btn-square;
  }

  #timer {
    font-size: 3em;
    font-weight: 100;
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
