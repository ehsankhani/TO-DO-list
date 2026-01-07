import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const appConfig = {
  LOCAL_STORAGE_KEY: process.env.LOCAL_STORAGE_KEY || "todo.state",
  THEME_STORAGE_KEY: process.env.THEME_STORAGE_KEY || "todo.theme",
  ANIMATION_MS: Number(process.env.ANIMATION_MS || 180),
};

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_CONFIG__: JSON.stringify(appConfig),
  },
});


