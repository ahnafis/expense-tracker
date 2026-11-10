import { StyleSheet, View, type ViewProps } from "react-native";

import { Typography } from "@/components";
import { useTheme } from "@/theme";

type BalanceCardProps = ViewProps & {
    data: number;
};

function BalanceCard(props: BalanceCardProps) {
    const { colors } = useTheme();

    return (
        <View style={[styles.card, props.style]}>
            <Typography style={{ color: colors.card_foreground }}>
                Current Balance
            </Typography>
            <Typography style={{ color: colors.card_foreground }} size="xxl">
                {props.data}
            </Typography>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export { BalanceCard };
export type { BalanceCardProps };
