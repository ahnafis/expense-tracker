import { FlatList } from "react-native";

import { type Transaction } from "@lib/core/features/tracker";

import { TransactionCard } from "./TransactionCard";

type TransactionListProps = {
    data: Transaction[];
};

const TransactionList = (props: TransactionListProps) => {
    return (
        <FlatList
            data={props.data}
            renderItem={({ item }) => <TransactionCard item={item} />}
            keyExtractor={item => String(item.id)}
        />
    );
};

export { TransactionList };
export type { TransactionListProps };
