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
