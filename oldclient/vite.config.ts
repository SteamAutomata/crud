import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Pages({
      dirs: [{ dir: "src/client/pages", baseRoute: "" }],
      extensions: ["tsx", "jsx"],
    }),
  ],
});
