<script lang="ts">
  let color: string = "#3c9df3";
  let selectedColor: string | null = null;
  let variationLimit: number = 20;

  type Color = {
    rgb: string;
    hsl: string;
    hex: string;
  };

  function generateColorShades(hexCode: string, numShades: number): string[] {
  const shades: string[] = [];
  
  const r = parseInt(hexCode.slice(1, 3), 16);
  const g = parseInt(hexCode.slice(3, 5), 16);
  const b = parseInt(hexCode.slice(5, 7), 16);
  
  const increment = Math.floor(255 / (numShades - 1));
  
  for (let i = 0; i < numShades; i++) {
    const newR = Math.max(r - i * increment, 0);
    const newG = Math.max(g - i * increment, 0);
    const newB = Math.max(b - i * increment, 0);
    
    const shade = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;

    if (shades.includes(shade)) continue;
    shades.push(shade);
  }
  
  return shades;
}

  function handleInformations(hexColor: string): Color {
    const rgb = hexColor
      .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
      , (m, r, g, b) => "#" + r + r + g + g + b + b)
      .substring(1)
      .match(/.{2}/g)
      ?.map(x => parseInt(x, 16))
      .join(", ");
    
    const hsl = hexColor
      .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
      , (m, r, g, b) => "#" + r + r + g + g + b + b)
      .substring(1)
      .match(/.{2}/g)
      ?.map(x => (parseInt(x, 16) / 255).toFixed(3))
      .join(", ");

    return {
      rgb: `rgb(${rgb})`,
      hsl: `hsl(${hsl})`,
      hex: hexColor
    };
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

      {#if variationLimit !== 100}
        <input
          type="number"
          class="px-3 py-2 border rounded-lg border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300"
          min="2"
          max="100"
          bind:value={variationLimit}
        />

        <button
          class="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300"
          on:click={() => variationLimit = 100}>
          Fluid
        </button>
      {:else}
        <button
          class="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300"
          on:click={() => variationLimit = 20}>
          Default
        </button>
      {/if}
    </div>

    <div class="flex mt-4 items-center justify-center">
      {#each generateColorShades(color, variationLimit) as variant}
        <div
          class="w-full h-20"
          on:click={() => selectedColor = variant}
          style="background-color: {variant}">
        </div>
      {/each}
    </div>

    {#if selectedColor !== null}
      <hr class="my-4 border-gray-700" />

      <div class="flex items-center mt-4 gap-2">
        <div class="w-20 h-20" style="background-color: {selectedColor}" />
        
        <div class="flex flex-col">
          <p class="text-gray-100 font-bold">RGB</p>
          <p class="text-gray-300">{handleInformations(selectedColor).rgb}</p>
        </div>
        <div class="flex flex-col">
          <p class="text-gray-100 font-bold">HSL</p>
          <p class="text-gray-300">{handleInformations(selectedColor).hsl}</p>
        </div>
        <div class="flex flex-col">
          <p class="text-gray-100 font-bold">HEX</p>
          <p class="text-gray-300">{handleInformations(selectedColor).hex}</p>
        </div>
      </div>
    {/if}

    <div class="flex">
      <button
        class="mt-4 w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300"
        on:click={() => selectedColor = null}>
        Reset
      </button>

      <button
        class="mt-4 ml-2 w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-gray-300 transition-colors duration-300 opacity-50"
        disabled>
        Save (Soon)
      </button>
    </div>
  </div>
</div>