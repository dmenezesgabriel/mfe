# Mfe Vite module federation

## Scaffolding

Create remote mfe application

```sh
# remote
# react
# typescript
pnpm create vite@latest
```

```sh
cd remote
```

```sh
pnpm add @originjs/vite-plugin-federation -D
```

Update package.json scripts to fix the port

```json
// mfe-vite-module-federation/remote/package.json
  "scripts": {
    "dev": "vite --port 5001 --strictPort",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview --port 5001 --strictPort",
    "serve": "vite preview --port 5001 --strictPort"
  },
```

Create host mfe application

```sh
# host
# react
# typescript
pnpm create vite@latest
```

```sh
cd host
```

```sh
pnpm add @originjs/vite-plugin-federation -D
```

Update package.json scripts to fix the port

```json
// mfe-vite-module-federation/host/package.json
  "scripts": {
    "dev": "vite --port 5001 --strictPort",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview --port 5001 --strictPort",
    "serve": "vite preview --port 5001 --strictPort"
  },
```

## Application code

Create a component to be shared

```jsx
// mfe-vite-module-federation/remote/src/components/Button.tsx
import { useState } from "react";

export function Button() {
  const [state, setState] = useState(0);

  return (
    <div>
      <button
        className="shared-btn"
        onClick={() => setState((previousState) => previousState + 1)}
      >
        Click me: {state}
      </button>
    </div>
  );
}
```

Add to main component

```jsx
// mfe-vite-module-federation/remote/src/App.tsx
import { useState } from "react";
import { Button } from "./components/Button";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Remote Application</h1>
      <Button />
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;
```

Update vite config

```ts
// mfe-vite-module-federation/remote/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: { "./Button": "./src/components/Button" },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
```

with vite, the remote application must be build then served so it can be consumed on the host

```sh
cd remote
```

```sh
pnpm build && pnpm serve
```

Check remote entry manifest at `http://localhost:5001/assets/remoteEntry.js`

```sh
cd host
```

Update host vite config

```ts
// mfe-vite-module-federation/host/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host",
      remotes: {
        remoteApp: "http://localhost:5001/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
```

Modify the host App component

```jsx
// mfe-vite-module-federation/host/src/App.tsx
import { useState } from "react";

import { Button } from "remoteApp/Button";

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Host Application</h1>
      <div>
        <Button />
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;
```

declare remoteApp components

```ts
// mfe-vite-module-federation/host/src/@types/remoteApp.d.ts
declare module "remoteApp/Button" {
  import { ComponentType, type ButtonHTMLAttributes } from "react";

  export const Button: ComponentType<ButtonHTMLAttributes<HTMLButtonElement>>;
}
```

Update tsconfig.app

```json
// mfe-vite-module-federation/host/tsconfig.app.json
  "include": [
    "src",
    "src/**/*.d.ts"
  ]
```

Run the host application

```sh
pnpm build && pnpm preview
```
