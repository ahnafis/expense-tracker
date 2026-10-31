import type { UniqueId } from "@/types";
import type { Transaction, TransactionFilter } from "../entities";

export interface TransactionStorage {
    find(filter?: TransactionFilter): Promise<Transaction[]>;
    findById(id: UniqueId): Promise<Transaction | undefined>;

    insert(transaction: Transaction): Promise<Transaction>;
    update(transaction: Transaction): Promise<Transaction>;
    delete(id: UniqueId): Promise<void>;
}
