import { UniqueId } from "@/types";
import { create_uid } from "@/utils";

import {
    Expense,
    Income,
    InvalidAmount,
    Transaction,
    TransactionKind,
    TransactionNotFound,
    TransactionSummary,
    Transfer,
} from "../entities";

import { TransactionFilter, TransactionStorage } from "../storage";

type TransactionInputBase = {
    amount: number;
    occurred_at?: number;
    note?: string;
};

type TransactionInputData =
    | (TransactionInputBase & Income)
    | (TransactionInputBase & Expense)
    | (TransactionInputBase & Transfer);

function getSignedAmount(transaction: Transaction): number {
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

function validateTransaction(data: TransactionInputData): void {
    if (data.amount <= 0) {
        throw new InvalidAmount("Amount must be positive");
    }

    switch (data.kind) {
        case TransactionKind.EXPENSE:
            if (!data.category) {
                throw new Error("Expense requires category");
            }
            break;

        case TransactionKind.INCOME:
            if (!data.source) {
                throw new Error("Income requires source");
            }
            break;

        case TransactionKind.LEND:
        case TransactionKind.REPAY_IN:
        case TransactionKind.BORROW:
        case TransactionKind.REPAY_OUT:
            if (!data.party) {
                throw new Error("Transfer requires party");
            }
            break;
    }
}

export class TransactionService {
    constructor(private storage: TransactionStorage) {}

    public async getBalance(): Promise<number> {
        const transactions = await this.storage.find();
        const init_balance = 0;

        return transactions.reduce((sum, transaction) => {
            return sum + getSignedAmount(transaction);
        }, init_balance);
    }

    public async getSummary(): Promise<TransactionSummary> {
        const transactions = await this.storage.find();
        const summary = new TransactionSummary();

        for (const transaction of transactions) {
            summary.net += getSignedAmount(transaction);

            switch (transaction.kind) {
                case TransactionKind.INCOME:
                    summary.income += transaction.amount;
                    break;
                case TransactionKind.EXPENSE:
                    summary.expense += transaction.amount;
                    break;
                case TransactionKind.LEND:
                    summary.lend += transaction.amount;
                    break;
                case TransactionKind.BORROW:
                    summary.borrow += transaction.amount;
                    break;
                case TransactionKind.REPAY_IN:
                    summary.repay_in += transaction.amount;
                    break;
                case TransactionKind.REPAY_OUT:
                    summary.repay_out += transaction.amount;
                    break;
            }
        }

        return summary;
    }

    public async listTransactions(
        filter?: TransactionFilter,
    ): Promise<Transaction[]> {
        return await this.storage.find(filter);
    }

    public async getTransactionById(
        id: UniqueId,
    ): Promise<Transaction | undefined> {
        return await this.storage.findById(id);
    }

    public async createTransaction(
        data: TransactionInputData,
    ): Promise<Transaction> {
        const normalized = {
            id: create_uid(),
            created_at: Date.now(),
            ...data,
            occurred_at: data.occurred_at ?? Date.now(),
        } as Transaction;

        validateTransaction(normalized);
        return await this.storage.insert(normalized);
    }

    public async updateTransaction(
        id: UniqueId,
        patch: TransactionInputData,
    ): Promise<Transaction> {
        const transactions = await this.storage.find();
        const current = transactions.find(tx => tx.id === id);

        if (!current) {
            throw new TransactionNotFound("Transaction not found");
        }

        const updated = { ...current, ...patch } as Transaction;

        validateTransaction(updated);
        return await this.storage.update(id, updated);
    }

    public async deleteTransaction(id: UniqueId): Promise<void> {
        await this.storage.delete(id);
    }
}
