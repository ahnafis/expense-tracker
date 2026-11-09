import { formatHex, formatHex8, parse } from "culori";

const toHex = (color: string) => {
    const parsed = parse(color);
    if (!parsed) {
        throw new Error(`Invalid color: ${color}`);
    }

    if (parsed.alpha !== undefined && parsed.alpha < 1) {
        return formatHex8(parsed);
    }
    return formatHex(parsed);
};

export type Colors = {
    background: string;
    foreground: string;
    card: string;
    card_foreground: string;
    popover: string;
    popover_foreground: string;
    primary: string;
    primary_foreground: string;
    secondary: string;
    secondary_foreground: string;
    muted: string;
    muted_foreground: string;
    accent: string;
    accent_foreground: string;
    destructive: string;
    border: string;
    input: string;
    ring: string;
    chart_1: string;
    chart_2: string;
    chart_3: string;
    chart_4: string;
    chart_5: string;
    sidebar: string;
    sidebar_foreground: string;
    sidebar_primary: string;
    sidebar_primary_foreground: string;
    sidebar_accent: string;
    sidebar_accent_foreground: string;
    sidebar_border: string;
    sidebar_ring: string;
    positive: string;
    negative: string;
};

export type ColorPalette = {
    light: Colors;
    dark: Colors;
};

export const color_palette: ColorPalette = {
    light: {
        background: toHex("oklch(1 0 0)"),
        foreground: toHex("oklch(0.145 0 0)"),
        card: toHex("oklch(1 0 0)"),
        card_foreground: toHex("oklch(0.145 0 0)"),
        popover: toHex("oklch(1 0 0)"),
        popover_foreground: toHex("oklch(0.145 0 0)"),
        primary: toHex("oklch(0.205 0 0)"),
        primary_foreground: toHex("oklch(0.985 0 0)"),
        secondary: toHex("oklch(0.97 0 0)"),
        secondary_foreground: toHex("oklch(0.205 0 0)"),
        muted: toHex("oklch(0.97 0 0)"),
        muted_foreground: toHex("oklch(0.556 0 0)"),
        accent: toHex("oklch(0.97 0 0)"),
        accent_foreground: toHex("oklch(0.205 0 0)"),
        destructive: toHex("oklch(0.577 0.245 27.325)"),
        border: toHex("oklch(0.922 0 0)"),
        input: toHex("oklch(0.922 0 0)"),
        ring: toHex("oklch(0.708 0 0)"),
        chart_1: toHex("oklch(0.87 0 0)"),
        chart_2: toHex("oklch(0.556 0 0)"),
        chart_3: toHex("oklch(0.439 0 0)"),
        chart_4: toHex("oklch(0.371 0 0)"),
        chart_5: toHex("oklch(0.269 0 0)"),
        sidebar: toHex("oklch(0.985 0 0)"),
        sidebar_foreground: toHex("oklch(0.145 0 0)"),
        sidebar_primary: toHex("oklch(0.205 0 0)"),
        sidebar_primary_foreground: toHex("oklch(0.985 0 0)"),
        sidebar_accent: toHex("oklch(0.97 0 0)"),
        sidebar_accent_foreground: toHex("oklch(0.205 0 0)"),
        sidebar_border: toHex("oklch(0.922 0 0)"),
        sidebar_ring: toHex("oklch(0.708 0 0)"),
        positive: toHex("oklch(0.527 0.154 150.069)"),
        negative: toHex("oklch(0.505 0.213 27.518)"),
    },
    dark: {
        background: toHex("oklch(0.145 0 0)"),
        foreground: toHex("oklch(0.985 0 0)"),
        card: toHex("oklch(0.205 0 0)"),
        card_foreground: toHex("oklch(0.985 0 0)"),
        popover: toHex("oklch(0.205 0 0)"),
        popover_foreground: toHex("oklch(0.985 0 0)"),
        primary: toHex("oklch(0.922 0 0)"),
        primary_foreground: toHex("oklch(0.205 0 0)"),
        secondary: toHex("oklch(0.269 0 0)"),
        secondary_foreground: toHex("oklch(0.985 0 0)"),
        muted: toHex("oklch(0.269 0 0)"),
        muted_foreground: toHex("oklch(0.708 0 0)"),
        accent: toHex("oklch(0.269 0 0)"),
        accent_foreground: toHex("oklch(0.985 0 0)"),
        destructive: toHex("oklch(0.704 0.191 22.216)"),
        border: toHex("oklch(1 0 0 / 10%)"),
        input: toHex("oklch(1 0 0 / 15%)"),
        ring: toHex("oklch(0.556 0 0)"),
        chart_1: toHex("oklch(0.87 0 0)"),
        chart_2: toHex("oklch(0.556 0 0)"),
        chart_3: toHex("oklch(0.439 0 0)"),
        chart_4: toHex("oklch(0.371 0 0)"),
        chart_5: toHex("oklch(0.269 0 0)"),
        sidebar: toHex("oklch(0.205 0 0)"),
        sidebar_foreground: toHex("oklch(0.985 0 0)"),
        sidebar_primary: toHex("oklch(0.488 0.243 264.376)"),
        sidebar_primary_foreground: toHex("oklch(0.985 0 0)"),
        sidebar_accent: toHex("oklch(0.269 0 0)"),
        sidebar_accent_foreground: toHex("oklch(0.985 0 0)"),
        sidebar_border: toHex("oklch(1 0 0 / 10%)"),
        sidebar_ring: toHex("oklch(0.556 0 0)"),
        positive: toHex("oklch(0.448 0.119 151.328)"),
        negative: toHex("oklch(0.444 0.177 26.899)"),
    },
} as const;

export const sizes = {
    typography: {
        xs: 12,
        sm: 14,
        base: 16,
        md: 18,
        lg: 20,
        xl: 24,
        xxl: 30,
    },

    spacing: {
        xs: 4,
        sm: 8,
        base: 12,
        md: 16,
        lg: 24,
        xl: 32,
    },

    radius: {
        sm: 6,
        md: 10,
        lg: 14,
        xl: 20,
        full: 9999,
    },
} as const;
