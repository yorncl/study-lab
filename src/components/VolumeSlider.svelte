<script>
  import { onMount, onDestroy } from "svelte";
  import { construct_svelte_component } from "svelte/internal";
  import { get, writable } from "svelte/store";

  import { volume } from "../store";

  const sliderWidth = 100; // width of the slider
  const maxVolume = 100; // maximum volume

  // initialize a writable store for the volume

  let slider;
  let thumb;

  // calculate the initial position of the thumb based on the current volume
  let thumbOffset = get(volume) * sliderWidth;
  let sliderPos;

  let isDragging = false;
  let currentVolume = get(volume);

  function handleMouseDown(event) {
    isDragging = true;
    sliderPos = slider.getBoundingClientRect().left;
    currentVolume = get(volume);
  }

  function handleMouseMove(event) {
    if (isDragging) {
      currentVolume = get(volume);
      let mousePos = event.clientX;

      // clamp the position to the thumb bounds
      if (mousePos < sliderPos) {
        thumbOffset = 0;
      } else if (mousePos > sliderPos + sliderWidth) {
        thumbOffset = sliderWidth;
      } else {
        thumbOffset = mousePos - sliderPos - 8;
      }

      // update the volume based on the new position
      let newVolume = thumbOffset / sliderWidth;

      volume.set(newVolume);
    }
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleMouseLeave() {
    isDragging = false;
  }

  // set up cleanup function to remove event listeners when component is destroyed
  onMount(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
  });

  onDestroy(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mouseleave", handleMouseLeave);
  });
</script>

<div class="slider" on:mousedown={handleMouseDown} bind:this={slider}>
  <div class="track" />
  <div class="thumb" bind:this={thumb} style={`left: ${thumbOffset}px`} />
</div>

<style>
  .slider {
    position: relative;
    height: 20px;
    background-color: #ddd;
    cursor: pointer;
    width: 100px;
  }

  .track {
    position: absolute;
    top: 8px;
    width: 100px;
    height: 4px;
    background-color: #555;
  }

  .thumb {
    position: absolute;
    top: 2px;
    width: 16px;
    height: 16px;
    background-color: #555;
    border-radius: 50%;
    cursor: pointer;
  }
</style>
