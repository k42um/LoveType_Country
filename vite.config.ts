import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base: "./" にすることで GitHub Pages のプロジェクトサイト
// (https://<user>.github.io/<repo>/) でもリポジトリ名に依存せず動作する。
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
