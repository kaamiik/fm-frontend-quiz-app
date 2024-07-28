// import htmlPurge from "vite-plugin-html-purgecss";

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        start: "index.html",
        question: "question.html",
        score: "score.html",
      },
    },
  },
});
