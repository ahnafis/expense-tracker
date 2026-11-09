import { StyleSheet, View } from "react-native";

import { sizes } from "@/theme";

import { BalanceCard, TransactionList } from "../components";
import { useTransactions } from "../providers";

export const TrackerScreen = () => {
    const { transactions, balance } = useTransactions();

    return (
        <View style={styles.screen}>
            <BalanceCard style={styles.balance_card} data={balance} />
            <TransactionList data={transactions} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    balance_card: {
        padding: sizes.spacing.base,
        margin: sizes.spacing.sm,
    },
});
