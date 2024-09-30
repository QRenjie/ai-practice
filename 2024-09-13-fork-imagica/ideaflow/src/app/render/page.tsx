"use client";

import { CodeBlock } from "@/types/apiTypes";
import React, { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";

const BASE_FILES = {
  "/src/index.js": `
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
`,
  "/src/App.js": `
import MyComponent from './MyComponent';

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to My React App</h1>
      <MyComponent />
    </div>
  );
}

export default App;
`,
  "/src/index.css": `
@tailwind base;
@tailwind components;
@tailwind utilities;
`,
  "/src/MyComponent.js": `
export default function MyComponent() {
  return (
    <div className="bg-blue-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">My Component</h2>
      <p className="text-gray-700">This is a sample component using Tailwind CSS.</p>
    </div>
  );
}
`,
  "/public/index.html": `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
`,
  "/tailwind.config.js": `
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
  "/package.json": `
{
  "name": "react-tailwind-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "4.0.3"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.7",
    "postcss": "^8.4.14",
    "tailwindcss": "^3.1.6"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
`,
};

export default function RenderPage({
  searchParams,
}: {
  searchParams: { code: string };
}) {
  const [files, setFiles] = useState(BASE_FILES);

  useEffect(() => {
    const codeBlock: CodeBlock = JSON.parse(
      decodeURIComponent(searchParams.code)
    );
    const { content: code } = codeBlock;

    setFiles((prevFiles) => ({
      ...prevFiles,
      "/src/MyComponent.js": code,
    }));
  }, [searchParams.code]);

  return (
    <SandpackProvider
      template="react"
      files={files}
      customSetup={{
        dependencies: {
          react: "^17.0.2",
          "react-dom": "^17.0.2",
          "react-scripts": "4.0.3",
          tailwindcss: "^3.1.6",
          autoprefixer: "^10.4.7",
          postcss: "^8.4.14",
        },
      }}
    >
      <SandpackLayout>
        <SandpackPreview
          showRefreshButton={false}
          showOpenInCodeSandbox={false}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
}
