import type { TimeStamp, UniqueId } from "@/types";

import type {
    Transaction,
    TransactionData,
    TransactionKind,
} from "../entities";

export type TransactionFilter = Partial<{
    id: UniqueId;

    kind: TransactionKind;

    occurred_from: TimeStamp;
    occurred_until: TimeStamp;

    min_amount: number;
    max_amount: number;

    note_query: string;
}>;

export type TransactionRow = Transaction;
export type TransactionPatch = Partial<TransactionData>;

export interface TransactionStorage {
    get(filter?: TransactionFilter): Promise<Transaction[]>;
    getById(id: UniqueId): Promise<Transaction | undefined>;

    add(data: TransactionRow): Promise<Transaction>;
    update(id: UniqueId, patch: TransactionPatch): Promise<Transaction>;
    delete(id: UniqueId): Promise<void>;
}
