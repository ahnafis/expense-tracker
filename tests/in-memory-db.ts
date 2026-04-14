import type { Transaction } from "@/features/tracker/entities";

import type {
    TransactionStorage,
    TransactionFilter,
    CreateTransactionInput,
    UpdateTransactionInput,
} from "@/features/tracker/storage";

import type { UniqueId } from "@/types";

import { create_uid } from "@/utils";

export class InMemoryTransactionStorage implements TransactionStorage {
    private transactions: Transaction[];

    constructor(data: Transaction[]) {
        this.transactions = data;
    }

    public get = async (
        filter?: Partial<TransactionFilter>,
    ): Promise<Transaction[]> => {
        let result = [...this.transactions];

        if (!filter) return result;

        if (filter.occurred_from) {
            result = result.filter(
                transaction => transaction.occurred_at >= filter.occurred_from!,
            );
        }

        if (filter.occurred_until) {
            result = result.filter(
                transaction =>
                    transaction.occurred_at <= filter.occurred_until!,
            );
        }

        if (filter.min_amount) {
            result = result.filter(
                transaction => transaction.amount >= filter.min_amount!,
            );
        }

        if (filter.max_amount) {
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

        return result;
    };

    public add = async (data: CreateTransactionInput): Promise<Transaction> => {
        const transaction: Transaction = {
            id: create_uid(),
            created_at: Date.now(),
            ...data,
        };

        this.transactions.push(transaction);
        return transaction;
    };

    public update = async (
        id: UniqueId,
        data: UpdateTransactionInput,
    ): Promise<Transaction> => {
        const index = this.transactions.findIndex(
            transaction => transaction.id === id,
        );
        const exists = index > -1;

        if (!exists) throw new Error("Not matches found. Nothing to update.");

        const updated = {
            ...this.transactions[index],
            ...data,
        };

        this.transactions[index] = updated;
        return updated;
    };

    public delete = async (id: UniqueId): Promise<void> => {
        this.transactions = this.transactions.filter(
            transaction => transaction.id !== id,
        );
    };
}
