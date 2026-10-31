import type { UniqueId } from "@/types";

import {
    type Transaction,
    type TransactionFilter,
    type TransactionStorage,
} from "@/features/tracker";

export class InMemoryTransactionStorage implements TransactionStorage {
    private transactions: Transaction[];

    constructor(data: Transaction[]) {
        this.transactions = structuredClone(data);
    }

    public async findById(id: UniqueId): Promise<Transaction | undefined> {
        const transaction = this.transactions.find(item => item.id === id);
        return transaction ? structuredClone(transaction) : undefined;
    }

    public async find(filter?: TransactionFilter): Promise<Transaction[]> {
        let result = [...this.transactions];

        const {
            id,
            kind,
            created_from,
            created_until,
            occurred_from,
            occurred_until,
            min_amount,
            max_amount,
            note_query,
        } = filter ?? {};

        if (id !== undefined) {
            result = result.filter(transaction => transaction.id === id);
        }

        if (kind !== undefined) {
            result = result.filter(transaction => transaction.kind === kind);
        }

        if (created_from !== undefined) {
            result = result.filter(
                transaction => transaction.created_at >= created_from,
            );
        }

        if (created_until !== undefined) {
            result = result.filter(
                transaction => transaction.created_at <= created_until,
            );
        }

        if (occurred_from !== undefined) {
            result = result.filter(
                transaction => transaction.occurred_at >= occurred_from,
            );
        }

        if (occurred_until !== undefined) {
            result = result.filter(
                transaction => transaction.occurred_at <= occurred_until,
            );
        }

        if (min_amount !== undefined) {
            result = result.filter(
                transaction => transaction.amount >= min_amount,
            );
        }

        if (max_amount !== undefined) {
            result = result.filter(
                transaction => transaction.amount <= max_amount,
            );
        }

        if (note_query) {
            const query = note_query.toLowerCase();

            result = result.filter(transaction =>
                transaction.note?.toLowerCase().includes(query),
            );
        }

        return result
            .toSorted((a, b) => b.occurred_at - a.occurred_at)
            .map(transaction => structuredClone(transaction));
    }

    public async insert(transaction: Transaction): Promise<Transaction> {
        const stored = structuredClone(transaction);
        this.transactions.push(stored);
        return structuredClone(stored);
    }

    public async update(transaction: Transaction): Promise<Transaction> {
        const index = this.transactions.findIndex(
            item => item.id === transaction.id,
        );

        if (index === -1) {
            throw new Error("Transaction not found.");
        }

        this.transactions[index] = structuredClone(transaction);
        return structuredClone(this.transactions[index]);
    }

    public async delete(id: UniqueId): Promise<void> {
        this.transactions = this.transactions.filter(
            transaction => transaction.id !== id,
        );
    }
}
