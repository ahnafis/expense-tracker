import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { TransactionProvider } from "@/features/tracker/providers";
import { TrackerScreen } from "@/features/tracker/screens";
import { sizes, ThemeProvider, useTheme } from "@/theme";

function MainContent() {
    const { colors } = useTheme();
    return (
        <TransactionProvider>
            <SafeAreaView
                style={[styles.main, { backgroundColor: colors.background }]}
                edges={["top", "left", "right"]}
            >
                <TrackerScreen />
            </SafeAreaView>
        </TransactionProvider>
    );
}

function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <MainContent />
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: sizes.spacing.md,
        gap: sizes.spacing.lg,
    },
});

export default App;
