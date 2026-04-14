import type { Entity, TimeStamp } from "@/types";

export type TransactionData = {
    occurred_at: TimeStamp;
    amount: number;
    note?: string;
};

export type Transaction = Entity & TransactionData;
