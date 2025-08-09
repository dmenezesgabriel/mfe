import { atom, useAtom } from "jotai";

const countAtom = atom(0);

export const useCount = () => useAtom(countAtom);
