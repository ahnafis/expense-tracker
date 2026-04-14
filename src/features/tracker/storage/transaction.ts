import type { TimeStamp, UniqueId } from "@/types";

import type { Transaction, TransactionData } from "../entities";

export type TransactionFilter = Partial<{
    id: UniqueId;

    occurred_from: TimeStamp;
    occurred_until: TimeStamp;

    min_amount: number;
    max_amount: number;

    note_query: string;
}>;

export type CreateTransactionInput = TransactionData;
export type UpdateTransactionInput = Partial<TransactionData>;

export interface TransactionStorage {
    get(filter?: TransactionFilter): Promise<Transaction[]>;

    add(data: CreateTransactionInput): Promise<Transaction>;
    update(id: UniqueId, data: UpdateTransactionInput): Promise<Transaction>;
    delete(id: UniqueId): Promise<void>;
}
