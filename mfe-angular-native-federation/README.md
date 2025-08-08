# Angular Native Federation Micro Frontend

Native Federation enable micro frontend architecture without the dependency of build tools like Webpack.

## Scaffolding

- **Create Workspace**:

```sh
npx @angular/cli@18 new mfe-angular-native-federation --create-application=false
```

- **Check version**:

```sh
ng --version
```

- **Generate host app**:

```sh
ng generate application shell --prefix app-shell
```

- **Generate mfe remote app**:

```sh
ng generate application todo --prefix app-todo
```

- **Configure native federation**:

The version of `@angular-architects/native-federation` must be the same of the angular packages

```sh
npm i -D @angular-architects/native-federation@18.2.2
```

Configure the host application

```sh
ng g @angular-architects/native-federation:init --project shell --port 4200 --type dynamic-host
```

Configure the remote application

```sh
ng g @angular-architects/native-federation:init --project todo --port 4201 --type remote
```

Update federation manifest

```json
// mfe-angular-native-federation/projects/shell/public/federation.manifest.json
{
  "todo": "http://localhost:4201/remoteEntry.json"
}
```

Adjust main.ts file

```ts
// mfe-angular-native-federation/projects/shell/src/main.ts
import { initFederation } from "@angular-architects/native-federation";

initFederation("federation.manifest.json")
  .catch((err) => console.error(err))
  .then((_) => import("./bootstrap"))
  .catch((err) => console.error(err));
```

Run mfe host

```sh
ng serve shell
```

Run mfe remote

```sh
ng serve todo
```

## Application code

```sh
ng g c pages/home --project shell
```

Create the routes at mfe shell application

```ts
// mfe-angular-native-federation/shell/src/app/app.routes.ts
import { Routes } from "@angular/router";
import { loadRemoteModule } from "@angular-architects/native-federation";
import { HomeComponent } from "./pages/home/home.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "todo",
    loadComponent: () =>
      loadRemoteModule("todo", "./Component").then(
        (module) => module.AppComponent
      ),
  },
  {
    path: "**",
    component: HomeComponent,
  },
];
```

Install tailwindcss

```sh
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init
```

Update tailwind config

```js
// mfe-angular-native-federation/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./projects/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Update both style files also

```scss
// mfe-angular-native-federation/projects/shell/src/styles.scss
// mfe-angular-native-federation/projects/todo/src/styles.scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Update shell App component:

```ts
// mfe-angular-native-federation/projects/shell/src/app/app.component.ts
import { Component } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: "app-shell-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink] // Added RouterLink,
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = "shell";
}
```

```html
<!-- mfe-angular-native-federation/projects/shell/src/app/app.component.html -->
<nav class="w-full py-3 bg-blue-500">
  <div class="max-w-7xl mx-auto flex justify-between">
    <h3 class="font-bold text-lg text-white">Angular Microfrontends</h3>
    <ul class="flex gap-2 items-center font-medium text-blue-100">
      <li>
        <a class="px-2 hover:text-white" routerLink="/"> Home </a>
      </li>
      <li>
        <a class="px-2 hover:text-white" routerLink="/todo"> Todo </a>
      </li>
    </ul>
  </div>
</nav>

<main class="max-w-7xl mx-auto p-4">
  <router-outlet />
</main>
```

Update Home component:

```html
<!-- mfe-angular-native-federation/projects/shell/src/app/pages/home/home.component.html -->
<div
  class="w-full flex justify-center items-center h-[300px] border-2 border-dashed border-gray-300"
>
  Home Application
</div>
```

Update remote App component

```html
<!-- mfe-angular-native-federation/projects/todo/src/app/app.component.html -->
<div
  class="w-full flex justify-center items-center h-[300px] border-2 border-dashed border-gray-300"
>
  Todo Application
</div>
```
