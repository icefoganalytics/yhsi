import { fileURLToPath, URL } from "node:url"

import vue from "@vitejs/plugin-vue2"
import { defineConfig } from "vite"

export default defineConfig({
  cacheDir: "/tmp/vite",
  plugins: [vue()],
  resolve: {
    alias: [
      { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
      // Vuetify 2 ships only a UMD build that require()s vue; without this the production
      // bundle gets a second CommonJS copy of Vue and the app renders nothing.
      { find: /^vue$/, replacement: "vue/dist/vue.runtime.esm.js" },
    ],
    // Existing imports omit the .vue extension; drop this once they are made explicit.
    extensions: [".mjs", ".js", ".json", ".vue"],
  },
  server: {
    port: 8080,
  },
})
