<script lang="ts">
  import { colorInfo, lightToDark } from "../lib/utils";
  import ColorPicker from "svelte-awesome-color-picker";
  
  let color: string = "#3c9df3";
  let selectedColor: string | null = null;
  let variationLimit: number = 14;

  const generateRandomColor = (): string => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
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
</script>

<div class="flex flex-col items-center mx-auto px-3 py-4 lg:py-0">
  <div class="w-full rounded-lg border p-4 shadow md:mt-0 sm:max-w-lg border-slate-700 bg-slate-800 sm:p-5">
    <h2 class="text-2xl font-bold text-center text-gray-100">Choose a color</h2>

    <div class="flex items-center mt-4 gap-2">
      <input
        type="text"
        class="w-full px-3 py-2 border rounded-lg border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300"
        bind:value={color}
      />

      <input
        type="number"
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

    <div class="flex">
      <button
        class="mt-4 w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300"
        on:click={() => handleResetColor()}>
        Reset
      </button>

      <button
        class="mt-4 ml-2 w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 transition-colors duration-300 opacity-50"
        disabled>
        Save (Soon)
      </button>
    </div>
  </div>

  <div class="mt-6 text-center text-gray-400">
    <p>Made with ❤️ by <a class="text-gray-200" href="https://github.com/Steellgold">Steellgold</a></p>
  </div>
</div>