import type { Entity, TimeStamp } from "@/types";

export type TransactionBase = {
    amount: number;
    occurred_at: TimeStamp;
    note: string;
};

export enum TransactionKind {
    INCOME = "income",
    EXPENSE = "expense",
    LEND = "lend",
    REPAY_IN = "repay_in",
    BORROW = "borrow",
    REPAY_OUT = "repay_out",
}

type Income = {
    kind: TransactionKind.INCOME;
    source: string;
};

type Expense = {
    kind: TransactionKind.EXPENSE;
    category: string;
};

type Transfer = {
    kind:
        | TransactionKind.LEND
        | TransactionKind.REPAY_IN
        | TransactionKind.BORROW
        | TransactionKind.REPAY_OUT;
    party: string;
};

export type MakeTransaction<Base> =
    | (Base & Income)
    | (Base & Expense)
    | (Base & Transfer);

export type Transaction = MakeTransaction<Entity & TransactionBase>;

export class TransactionSummary {
    constructor(
        public income = 0,
        public expense = 0,
        public lend = 0,
        public repay_in = 0,
        public borrow = 0,
        public repay_out = 0,
        public net = 0,
    ) {}
}
