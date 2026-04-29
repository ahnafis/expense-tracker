import type { Transaction } from "@/features/tracker/entities";

import type {
    TransactionStorage,
    TransactionFilter,
    TransactionPatch,
    TransactionRow,
} from "@/features/tracker/storage";

import type { UniqueId } from "@/types";

export class InMemoryTransactionStorage implements TransactionStorage {
    private transactions: Transaction[];

    constructor(data: Transaction[]) {
        this.transactions = structuredClone(data);
    }

    public async get(filter?: TransactionFilter): Promise<Transaction[]> {
        let result = [...this.transactions];

        if (!filter) {
            return result.sort((a, b) => b.occurred_at - a.occurred_at);
        }

        if (filter.kind !== undefined) {
            result = result.filter(
                transaction => transaction.kind === filter.kind,
            );
        }

        if (filter.occurred_from !== undefined) {
            result = result.filter(
                transaction => transaction.occurred_at >= filter.occurred_from!,
            );
        }

        if (filter.occurred_until !== undefined) {
            result = result.filter(
                transaction =>
                    transaction.occurred_at <= filter.occurred_until!,
            );
        }

        if (filter.min_amount !== undefined) {
            result = result.filter(
                transaction => transaction.amount >= filter.min_amount!,
            );
        }

        if (filter.max_amount !== undefined) {
            result = result.filter(
                transaction => transaction.amount <= filter.max_amount!,
            );
        }

        if (filter.note_query) {
            const query = filter.note_query.toLowerCase();

            result = result.filter(transaction =>
                transaction.note?.toLowerCase().includes(query),
            );
        }

        return result.sort((a, b) => b.occurred_at - a.occurred_at);
    }

    public async getById(id: UniqueId): Promise<Transaction | undefined> {
        return this.transactions.find(transaction => transaction.id === id);
    }

    public async add(data: TransactionRow): Promise<Transaction> {
        if (data.amount <= 0) {
            throw new Error("Amount must be positive.");
        }

        this.transactions.push(data);
        return data;
    }

    public async update(
        id: UniqueId,
        patch: TransactionPatch,
    ): Promise<Transaction> {
        if (patch.amount !== undefined && patch.amount <= 0) {
            throw new Error("Amount must be positive.");
        }

        const index = this.transactions.findIndex(
            transaction => transaction.id === id,
        );

        const exists = index > -1;

        if (!exists) throw new Error("Not matches found. Nothing to update.");

        const updated = {
            ...this.transactions[index],
            ...patch,
        } as Transaction;

        this.transactions[index] = updated;
        return updated;
    }

    public async delete(id: UniqueId): Promise<void> {
        this.transactions = this.transactions.filter(
            transaction => transaction.id !== id,
        );
    }
}
