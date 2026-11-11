import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
    name: "Expense Tracker",
    slug: "expense-tracker",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    experiments: {
        tsconfigPaths: true,
    },
    plugins: ["expo-sqlite"],
};

export default config;
