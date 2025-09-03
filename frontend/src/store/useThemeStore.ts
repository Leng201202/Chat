import { create } from "zustand";

interface ThemeState {
    theme: string;
    setTheme: (theme: string) => void;
}

export const useThemeStore= create<ThemeState>((set)=>({
    theme:localStorage.getItem("theme") || "light",
    setTheme: (theme: string) => {
        localStorage.setItem("theme", theme);
        set({ theme });
    }
}))
