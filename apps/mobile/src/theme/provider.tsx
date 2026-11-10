import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

import { color_palette, type Colors } from "./tokens";

type ThemePreference = "system" | "light" | "dark";

type ThemeContextValue = {
    colors: Colors;
    preference: ThemePreference;
    setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useTheme() {
    const theme = useContext(ThemeContext);
    if (!theme) {
        throw new Error("Component must be within a theme provider");
    }
    return theme;
}

function ThemeProvider(props: { children: React.ReactNode }) {
    const system_theme = useColorScheme();
    const [preference, setPreference] = useState<ThemePreference>("system");

    const resolved_theme =
        preference === "system" ? (system_theme ?? "light") : preference;

    const colors: Colors =
        resolved_theme === "dark" ? color_palette.dark : color_palette.light;

    return (
        <ThemeContext.Provider value={{ colors, preference, setPreference }}>
            {props.children}
        </ThemeContext.Provider>
    );
}

export { ThemeProvider, useTheme };
