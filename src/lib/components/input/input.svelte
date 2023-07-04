<script lang="ts">
  export let value: string | number;

  export let placeholder: string;
  export let type: "text" | "number" = "text";

  export let full = false;

  export let min: number | null = null;
  export let max: number | null = null;
  export let step: number | null = null;

  export const defaultValue: string | number | null = null;

  let id = Math.random().toString(36).substring(2);

  const update = (event: Event) => {
    const target = event.target as HTMLInputElement;
    value = target.value;
  }
</script>

<label for={id} class="sr-only">{placeholder}</label>
<input
  type={type}
  id={id}
  placeholder={placeholder}
  min={min}
  max={max}
  step={step}
  class="{full ? "w-full": ""} px-3 py-2 border rounded-lg border-slate-700 bg-slate-800 text-gray-300 focus:outline-none focus:border-slate-500 hover:border-slate-500 transition-colors duration-300"
  on:input={update}
  {value}
/>