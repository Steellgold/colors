<script lang="ts">
  import { onMount } from "svelte";
  import { colorInfo, getCSSBackgroundLinearGradient, lightToDark, randomColor } from "../lib/utils";
  import { IconPlus, IconCSS, IconCodeOff, IconTailwind } from "$lib/icons";
  import { Input } from "$lib/components/input";
  import ColorPicker from "svelte-awesome-color-picker";
  
  let color = "";
  let selectedColor: string | null = null;
  let variationLimit = 14;
  let showCSS: "css" | "tailwind" | null = null;

  $: colors = lightToDark(color, variationLimit);

  let favorites: string[] = [];
  $: favorites = [];

  onMount(async () => {
    const res = await fetch("/api/favorites");
    favorites = await res.json();
    color = randomColor();
  });

  let copied = false;

  const handleCopy = async (text: string): Promise<void> => {
    navigator.clipboard.writeText(text);
    copied = true;

    setTimeout(() => {
      copied = false;
    }, 2000);
  }

  const handleResetColor = (): void => {
    color = randomColor();
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

  const changeShowCSS = (): void => {
    if (showCSS === null) {
      showCSS = "css";
    } else if (showCSS === "css") {
      showCSS = "tailwind";
    } else if (showCSS === "tailwind") {
      showCSS = null;
    }
  }
</script>

<div class="flex flex-col items-center mx-auto px-3 py-4 lg:py-0">
  <div class="w-full rounded-lg border p-4 shadow md:mt-0 sm:max-w-lg border-slate-700 bg-slate-800 sm:p-5">
    <h2 class="text-2xl font-bold text-center text-gray-100">Choose a color</h2>

    <div class="flex items-center mt-4 gap-2">
      <Input defaultValue={color} full={true} placeholder="#ffffff" bind:value={color} />
      <Input defaultValue={variationLimit} type="number" min={2} max={26} step={2} placeholder="4" bind:value={variationLimit} />
      <button
        class="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300 hover:text-slate-300"
        on:click={(() => changeShowCSS())}>
        {#if showCSS === null}
          <IconCSS />
        {:else if showCSS === "css"}
          <IconTailwind />
        {:else if showCSS === "tailwind"}
          <IconCodeOff />
        {/if}
      </button>
      <ColorPicker hex={color} label="" on:input={e => color = e.detail.hex} isDark={true} />
      <style>
        @media (max-width: 640px) {
          .isOpen {
            right: -30px;
          }
        }

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

    {#if color !== ""}
      {#if showCSS !== null}
        {#if showCSS !== null}
          <div style="{getCSSBackgroundLinearGradient(colors, "css")}" class="w-full h-20 mt-4" />
        {/if}
      {:else}
        <div class="flex mt-4 items-center justify-center">
          {#each colors as variant}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <div
                class="w-full h-20"
                on:click={() => selectedColor = variant}
                style="background-color: {variant}">
            </div>
          {/each}
        </div>
      {/if}
    {/if}

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
        {#each favorites.slice(0, 20) as variant}
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

      {#if showCSS !== null}
        <button
          class="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300"
          on:click={() => handleCopy(getCSSBackgroundLinearGradient(colors, showCSS === "css" ? "css" : "tailwind"))}>
          {#if showCSS == "css"}
            Copy CSS
          {:else}
            Copy TailwindCSS
          {/if}
        </button>
      {/if}


      {#if selectedColor !== null}
        <button
          class="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300 hover:text-slate-300"
          on:click={() => addToFavorites()}>
          <IconPlus />
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