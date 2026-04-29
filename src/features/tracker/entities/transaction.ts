import type { Entity, TimeStamp } from "@/types";

export enum TransactionKind {
    INCOME = "income",
    EXPENSE = "expense",
    LEND = "lend",
    BORROW = "borrow",
    REPAY_IN = "repay_in",
    REPAY_OUT = "repay_out",
}

export type Income = {
    kind: TransactionKind.INCOME;
    source: string;
};

export type Expense = {
    kind: TransactionKind.EXPENSE;
    category: string;
};

export type Transfer = {
    kind:
        | TransactionKind.LEND
        | TransactionKind.REPAY_IN
        | TransactionKind.BORROW
        | TransactionKind.REPAY_OUT;
    party?: string;
};

export type TransactionBase = {
    amount: number;
    occurred_at: TimeStamp;
    note?: string;
};

export type TransactionData =
    | (TransactionBase & Income)
    | (TransactionBase & Expense)
    | (TransactionBase & Transfer);

export type Transaction = Entity & TransactionData;

export class TransactionSummary {
    constructor(
        public income: number = 0,
        public expense: number = 0,
        public lend: number = 0,
        public borrow: number = 0,
        public repay_in: number = 0,
        public repay_out: number = 0,
        public net: number = 0,
    ) {}
}
