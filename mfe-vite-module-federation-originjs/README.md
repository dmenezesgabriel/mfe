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
pnpm add jotai
```

```sh
pnpm add @originjs/vite-plugin-federation -D
```

Update package.json scripts to fix the port

```json
// mfe-vite-module-federation-originjs/remote/package.json
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
// mfe-vite-module-federation-originjs/host/package.json
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
// mfe-vite-module-federation-originjs/remote/src/components/Button.tsx
import "./Button.css";
import { useCount } from "../store";

export function Button() {
  const [state, setState] = useCount();

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

```css
/* mfe-vite-module-federation-originjs/remote/src/components/Button.css */
.shared-btn {
  background: #000;
  color: #fff;
  border: 1px solid #000;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
```

Add to main component

```jsx
// mfe-vite-module-federation-originjs/remote/src/App.tsx
import { Button } from "./components/Button";
import { useCount } from "./store";

export function App() {
  const [count, setCount] = useCount();

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
```

Create a store to share state between the host and remote

```ts
// mfe-vite-module-federation-originjs/remote/src/store.ts
import { atom, useAtom } from "jotai";

const countAtom = atom(0);

export const useCount = () => useAtom(countAtom);
```

Update vite config

```ts
// mfe-vite-module-federation-originjs/remote/vite.config.ts
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
      exposes: {
        "./Button": "./src/components/Button",
        "./store": "./src/store",
      },

      shared: ["react", "react-dom", "jotai"],
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
// mfe-vite-module-federation-originjs/host/vite.config.ts
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
// mfe-vite-module-federation-originjs/host/src/App.tsx
import { Button } from "remoteApp/Button";
import { useCount } from "remoteApp/store";

export function App() {
  const [count, setCount] = useCount();

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
```

declare remoteApp components

```ts
// mfe-vite-module-federation-originjs/host/src/@types/remoteApp.d.ts
declare module "remoteApp/Button" {
  import { ComponentType, type ButtonHTMLAttributes } from "react";

  export const Button: ComponentType<ButtonHTMLAttributes<HTMLButtonElement>>;
}

declare module "remoteApp/store" {
  import { PrimitiveAtom } from "jotai";
  export const countAtom: PrimitiveAtom<number>;
  export const useCount: () => [
    number,
    (update: number | ((prev: number) => number)) => void
  ];
}
```

Update tsconfig.app

```json
// mfe-vite-module-federation-originjs/host/tsconfig.app.json
  "include": [
    "src",
    "src/**/*.d.ts"
  ]
```

Run the host application

```sh
pnpm build && pnpm preview
```

## Reference

- [Vite and Module Federation](https://www.youtube.com/watch?v=t-nchkL9yIg)
