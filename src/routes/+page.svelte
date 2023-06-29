<script lang="ts">
  import { onMount } from "svelte";
  import { colorInfo, lightToDark } from "../lib/utils";
  import ColorPicker from "svelte-awesome-color-picker";
  import { IconStar } from "$lib/icons";
  
  let color: string = "#3c9df3";
  let selectedColor: string | null = null;
  let variationLimit: number = 14;

  let favorites: string[] = [];
  $: favorites = [];

  onMount(async () => {
    const res = await fetch("/api/favorites");
    favorites = await res.json();
  });

  const generateRandomColor = (): string => {
    const min = 0x100000;
    const max = 0xffffff;
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    return "#" + random.toString(16);
  }

  let copied: boolean = false;

  const handleCopy = async (text: string): Promise<void> => {
    navigator.clipboard.writeText(text);
    copied = true;

    setTimeout(() => {
      copied = false;
    }, 2000);
  }

  const handleResetColor = (): void => {
    color = generateRandomColor();
    selectedColor = null;
  }

  const addToFavorites = async (): Promise<void> => {
    if (color !== null) {
      if (selectedColor == null) return;

      let res = await fetch("/api/favorites?color=" + selectedColor.replace("#", ""), {
        method: "POST",
      });

      favorites = await res.json();
    }
  }
</script>

<div class="flex flex-col items-center mx-auto px-3 py-4 lg:py-0">
  <div class="w-full rounded-lg border p-4 shadow md:mt-0 sm:max-w-lg border-slate-700 bg-slate-800 sm:p-5">
    <h2 class="text-2xl font-bold text-center text-gray-100">Choose a color</h2>

    <div class="flex items-center mt-4 gap-2">
      <label for="color" class="sr-only">Color</label>
      <input
        type="text"
        id="color"
        class="w-full px-3 py-2 border rounded-lg border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300"
        bind:value={color}
      />

      <label for="variationLimit" class="sr-only">Variation limit</label>
      <input
        type="number"
        id="variationLimit"
        class="px-3 py-2 border rounded-lg border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300"
        min="2"
        step="2"
        max="26"
        bind:value={variationLimit}
      />

      <ColorPicker hex={color} label="" on:input={e => color = e.detail.hex} isDark={true} />
      <style>
        .isOpen.isOpen {
          background-color: #1f2937;
          border: 1px solid #334155;
          
          .text-input {
            display: none;
          }
          .slider-wrapper:nth-child(3) {
            display: none;
          }
        }
      </style>
    </div>

    <div class="flex mt-4 items-center justify-center">
      {#each lightToDark(color, variationLimit) as variant}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="w-full h-20"
            on:click={() => selectedColor = variant}
            style="background-color: {variant}">
        </div>
      {/each}
    </div>

    {#if selectedColor && selectedColor !== null}
      <hr class="my-4 border-gray-700" />

      <div class="flex items-center mt-4 gap-2">
        <div class="w-20 h-20" style="background-color: {selectedColor}" />
        
        <div class="flex flex-col">
          <p class="text-gray-100 font-bold">RGB</p>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <p class="text-gray-300 cursor-pointer" on:click={() => handleCopy(colorInfo(selectedColor).rgb)}>
            {colorInfo(selectedColor).rgb}
          </p>
        </div>
        <div class="flex flex-col">
          <p class="text-gray-100 font-bold">HSL</p>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <p class="text-gray-300 cursor-pointer" on:click={() => handleCopy(colorInfo(selectedColor).hsl)}>
            {colorInfo(selectedColor).hsl}
          </p>
        </div>
        <div class="flex flex-col">
          <p class="text-gray-100 font-bold">HEX</p>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <p class="text-gray-300 cursor-pointer" on:click={() => handleCopy(colorInfo(selectedColor).hex)}>
            {colorInfo(selectedColor).hex}
          </p>
        </div>
      </div>
    {/if}

    {#if copied}
      <p class="mt-4 text-center text-green-500">Copied!</p>
    {/if}

    {#if favorites.length >= 1}
      <div class="flex mt-4 gap-2">
        {#each favorites.slice(0, 10) as variant}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            class="w-5 h-5 rounded-full cursor-pointer"
            style="background-color: #{variant}"
            on:click={() => color = "#" + variant}>
          </div>
        {/each}
      </div>
    {/if}

    <div class="mt-4 flex gap-2">
      <button
        class="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300"
        on:click={() => handleResetColor()}>
        Reset
      </button>

      {#if selectedColor !== null}
        <button
          class="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300 hover:text-yellow-400"
          on:click={() => addToFavorites()}>
          <IconStar />
        </button>
      {/if}
    </div>
  </div>

  <div class="mt-6 text-center text-gray-400">
    <p>Made with ❤️ by <a class="text-gray-200" href="https://github.com/Steellgold">Steellgold</a></p>
  </div>
  
  <div class="fixed md:absolute bottom-0 sm:bottom-auto right-0 md:top-0 z-10 gap-4 p-4">
    <a href="https://www.buymeacoffee.com/steellg0ld" class="hover:opacity-75 transition-opacity duration-300" target="_blank">
      <img class="h-10" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="150" height="40" />
    </a>
  </div>
</div>