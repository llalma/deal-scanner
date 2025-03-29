import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import Icons from "unplugin-icons/vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss(),
    Icons({
      compiler: "svelte",
    }),
  ],
  build: {
    target: "es2015",
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "src/popup/index.html"),
        service_worker: "src/service_worker/message_reciever.ts",
        helpers: "src/helpers/helpers.ts",
      },
      output: {
        entryFileNames: (chunk) => {
          return "src/[name]/[name].js";
        },
        chunkFileNames: "src/[name]/[name].js",
        assetFileNames: "src/[name]/[name].[ext]",
      },
    },
  },
  publicDir: "public",
});
