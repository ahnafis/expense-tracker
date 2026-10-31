import type { Entity, TimeStamp, UniqueId } from "@/types";

export enum TransactionKind {
    INCOME = "income",
    EXPENSE = "expense",
    LEND = "lend",
    REPAY_IN = "repay_in",
    BORROW = "borrow",
    REPAY_OUT = "repay_out",
}

export type Transaction = Entity & {
    amount: number;
    kind: TransactionKind;
    occurred_at: TimeStamp;
    note: string;
};

export type TransactionFilter = Partial<{
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
