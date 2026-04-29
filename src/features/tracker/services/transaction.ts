import type { TimeStamp, UniqueId } from "@/types";

import { create_uid } from "@/utils";

import {
    type Expense,
    type Income,
    type Transaction,
    type TransactionData,
    type Transfer,
    TransactionKind,
    TransactionSummary,
} from "../entities";

import type { TransactionFilter, TransactionStorage } from "../storage";

type CreateTransactionBase = {
    amount: number;
    occurred_at?: TimeStamp;
    note?: string;
};

type CreateTransactionRecord =
    | (CreateTransactionBase & Expense)
    | (CreateTransactionBase & Income)
    | (CreateTransactionBase & Transfer);

type UpdateTransactionRecord = Partial<CreateTransactionRecord>;

export default class TransactionService {
    constructor(private readonly storage: TransactionStorage) {}

    public async getBalance(): Promise<number> {
        const transactions = await this.storage.get();

        return transactions.reduce((sum, transaction) => {
            return sum + this.getSignedAmount(transaction);
        }, 0);
    }

    public async getTransactionById(
        id: UniqueId,
    ): Promise<Transaction | undefined> {
        return await this.storage.getById(id);
    }

    public async listTransactions(
        filter?: TransactionFilter,
    ): Promise<Transaction[]> {
        return await this.storage.get(filter);
    }

    private getSignedAmount(transaction: Transaction): number {
        switch (transaction.kind) {
            case TransactionKind.INCOME:
            case TransactionKind.REPAY_IN:
            case TransactionKind.BORROW:
                return transaction.amount;

            case TransactionKind.EXPENSE:
            case TransactionKind.LEND:
            case TransactionKind.REPAY_OUT:
                return -transaction.amount;
        }
    }

    public async getSummary(): Promise<TransactionSummary> {
        const transactions = await this.storage.get();
        const summary = new TransactionSummary();

        for (const transaction of transactions) {
            switch (transaction.kind) {
                case TransactionKind.INCOME:
                    summary.income += transaction.amount;
                    summary.net += transaction.amount;
                    break;

                case TransactionKind.EXPENSE:
                    summary.expense += transaction.amount;
                    summary.net -= transaction.amount;
                    break;

                case TransactionKind.LEND:
                    summary.lend += transaction.amount;
                    summary.net -= transaction.amount;
                    break;

                case TransactionKind.BORROW:
                    summary.borrow += transaction.amount;
                    summary.net += transaction.amount;
                    break;

                case TransactionKind.REPAY_IN:
                    summary.repay_in += transaction.amount;
                    summary.net += transaction.amount;
                    break;

                case TransactionKind.REPAY_OUT:
                    summary.repay_out += transaction.amount;
                    summary.net -= transaction.amount;
                    break;
            }
        }

        return summary;
    }

    public async createTransaction(
        data: CreateTransactionRecord,
    ): Promise<Transaction> {
        const normalized: Transaction = {
            id: create_uid(),
            created_at: Date.now(),
            ...data,
            occurred_at: data.occurred_at ?? Date.now(),
        };

        this.validateTransaction(normalized);
        return await this.storage.add(normalized);
    }

    public async updateTransaction(
        id: UniqueId,
        patch: UpdateTransactionRecord,
    ): Promise<Transaction> {
        const transactions = await this.storage.get();

        const current = transactions.find(tx => tx.id === id);

        if (!current) {
            throw new Error("Transaction not found.");
        }

        const updated = {
            ...current,
            ...patch,
        } as Transaction;

        this.validateTransaction(updated);

        return await this.storage.update(id, patch);
    }

    public async deleteTransaction(id: UniqueId): Promise<void> {
        await this.storage.delete(id);
    }

    private validateTransaction(data: TransactionData): void {
        if (data.amount <= 0) {
            throw new Error("Amount must be positive.");
        }

        switch (data.kind) {
            case TransactionKind.EXPENSE:
                if (!data.category)
                    throw new Error("Expense requires category.");
                break;

            case TransactionKind.INCOME:
                if (!data.source) throw new Error("Income requires source.");
                break;

            case TransactionKind.LEND:
            case TransactionKind.BORROW:
            case TransactionKind.REPAY_IN:
            case TransactionKind.REPAY_OUT:
                if (!data.party) throw new Error("Transfer requires party.");
                break;
        }
    }
}
