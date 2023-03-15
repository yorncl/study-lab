<script>
  // import all settings from store
  import { freqLeft, freqRight } from "../store.js";

  function close() {
    // close the modal
  }
</script>

<main>
  <div class="modal">
    <div id="exitSettings" on:click={close} />
    This is a modal

    <div>
      <div>
        <label for="freqLeft">Left frequency</label>
        <input
          type="number"
          id="freqLeft"
          bind:value={freqLeft}
          min="0"
          max="1000"
        />
        <div>
          <label for="freqRight">Right frequency</label>
          <input
            type="number"
            id="freqRight"
            bind:value={freqRight}
            min="0"
            max="1000"
          />
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 300px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    z-index: 9999;
  }
</style>
