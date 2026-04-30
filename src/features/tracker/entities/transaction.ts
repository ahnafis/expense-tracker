import { Entity, TimeStamp } from "@/types";

export type TransactionBase = Entity & {
    amount: number;
    occurred_at: TimeStamp;
    note?: string;
};

export enum TransactionKind {
    INCOME,
    EXPENSE,
    LEND,
    REPAY_IN,
    BORROW,
    REPAY_OUT,
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

export type Transaction =
    | (TransactionBase & Income)
    | (TransactionBase & Expense)
    | (TransactionBase & Transfer);

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
