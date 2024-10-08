"use client";

import React from "react";
import { Sandpack } from "@codesandbox/sandpack-react";

const files = {
  "/App.jsx": `
import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">
        Hello, React + Tailwind CSS!
      </h1>
    </div>
  );
}
`,
  "/styles.css": `
@tailwind base;
@tailwind components;
@tailwind utilities;
`,
  "/postcss.config.js": {
    code: "module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}\n",
  },
  "/tailwind.config.js": {
    code: "/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: [\n    \"./**/*.{js,jsx,ts,tsx}\",\n  ],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};\n",
  },
  "/vite.config.js": `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
})
`,
};

export default function RenderPage() {
  return (
    <Sandpack
      template="vite-react"
      customSetup={{
        dependencies: {
          "tailwindcss": "^3.4.3",
          "postcss": "^8.4.4",
          "autoprefixer": "^10.4.19",
        },
      }}
      files={files}
      theme="light"
    />
  );
}
