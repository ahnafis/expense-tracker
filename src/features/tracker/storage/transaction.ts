import { TimeStamp, UniqueId } from "@/types";
import { Transaction, TransactionKind } from "../entities";

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

export interface TransactionStorage {
    find(filter?: TransactionFilter): Promise<Transaction[]>;
    findById(id: UniqueId): Promise<Transaction | undefined>;

    insert(data: Transaction): Promise<Transaction>;
    update(id: UniqueId, data: Transaction): Promise<Transaction>;
    delete(id: UniqueId): Promise<void>;
}
