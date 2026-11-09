import { StyleSheet } from "react-native";

import { type Transaction, TransactionKind } from "@lib/core/features/tracker";

import { Card, CardText } from "@/components";
import { sizes, useTheme } from "@/theme";

export type TransactionRowProps = {
    item: Transaction;
};

type AmountSignType = "positive" | "negative";

const getAmountSign = (transaction: Transaction): AmountSignType => {
    switch (transaction.kind) {
        case TransactionKind.INCOME:
        case TransactionKind.BORROW:
        case TransactionKind.REPAY_IN:
            return "positive";

        case TransactionKind.EXPENSE:
        case TransactionKind.LEND:
        case TransactionKind.REPAY_OUT:
            return "negative";
    }
};

export const TransactionCard = (props: TransactionRowProps) => {
    const { colors } = useTheme();

    const sign = getAmountSign(props.item);
    const amount_sign = getAmountSign(props.item) === "positive" ? "+" : "-";

    return (
        <Card style={styles.transaction_card}>
            <CardText size="md">{props.item.note}</CardText>
            <CardText size="md" style={{ color: colors[sign] }}>
                {amount_sign}
                {props.item.amount}
            </CardText>
        </Card>
    );
};

const styles = StyleSheet.create({
    transaction_card: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: sizes.spacing.xs,
        marginLeft: 0,
        marginRight: 0,
    },
});
