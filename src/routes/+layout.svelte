<script>
  import { dev } from "$app/environment";
  import { inject } from "@vercel/analytics";
  import "../app.css";

  inject({ mode: dev ? 'development' : 'production' });
</script>


<div class="mt-5">
  <slot />
</div>