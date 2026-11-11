import type { Entity, TimeStamp, UniqueId } from "@/types";

enum TransactionKind {
    INCOME = "income",
    EXPENSE = "expense",
    LEND = "lend",
    REPAY_IN = "repay_in",
    BORROW = "borrow",
    REPAY_OUT = "repay_out",
}

type Transaction = Entity & {
    amount: number; // In Paisa
    kind: TransactionKind;
    occurred_at: TimeStamp;
    note: string;
};

type TransactionFilter = Partial<{
    id: UniqueId;

    kind: TransactionKind;

    created_from: TimeStamp;
    created_until: TimeStamp;

    occurred_from: TimeStamp;
    occurred_until: TimeStamp;

    min_amount: number;
    max_amount: number;

    note_query: string;
}>;

export { TransactionKind };
export type { Transaction, TransactionFilter };
