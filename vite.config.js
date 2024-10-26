import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: "8080",
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "lib",
        replacement: resolve(__dirname, "lib"),
      },
    ],
  },
  build: {
    // チャンクサイズの警告を表示する閾値を1000kBに引き上げ
    chunkSizeWarningLimit: 1000,
    // manualChunksを使ってコードスプリッティングを設定
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // すべての依存関係を"vendor"チャンクに分割
            return "vendor";
          }
        },
      },
    },
  },
});
