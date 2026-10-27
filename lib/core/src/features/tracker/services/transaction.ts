import type { TimeStamp, UniqueId } from "@/types";

import {
    InvalidAmount,
    InvalidTransaction,
    type MakeTransaction,
    type Transaction,
    TransactionKind,
    TransactionNotFound,
    TransactionSummary,
} from "../entities";

import { create_uid } from "@/utils";
import type { TransactionFilter, TransactionStorage } from "../storage";

type TransactionInputBase = {
    amount: number;
    occurred_at?: TimeStamp;
    note?: string;
};

type TransactionInput = MakeTransaction<TransactionInputBase>;
type TransactionPatch = Partial<TransactionInputBase>;

interface TransactionServiceInterface {
    getBalance(): Promise<number>;
    getSummary(): Promise<TransactionSummary>;

    listTransactions(filter?: TransactionFilter): Promise<Transaction[]>;

    createTransaction(data: TransactionInput): Promise<Transaction>;
    updateTransaction(
        id: UniqueId,
        patch: TransactionPatch,
    ): Promise<Transaction>;
    deleteTransaction(id: UniqueId): Promise<void>;
}

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

function validateTransaction(data: TransactionInput): void {
    if (data.amount <= 0) {
        throw new InvalidAmount("Amount must be positive");
    }

    switch (data.kind) {
        case TransactionKind.EXPENSE:
            if (!data.category) {
                throw new InvalidTransaction("Expense requires category");
            }
            break;

        case TransactionKind.INCOME:
            if (!data.source) {
                throw new InvalidTransaction("Income requires source");
            }
            break;

        case TransactionKind.LEND:
        case TransactionKind.REPAY_IN:
        case TransactionKind.BORROW:
        case TransactionKind.REPAY_OUT:
            if (!data.party) {
                throw new InvalidTransaction("Transfer requires party");
            }
            break;
    }
}

export class TransactionService implements TransactionServiceInterface {
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
        data: TransactionInput,
    ): Promise<Transaction> {
        const now = Date.now();

        const transaction: Transaction = {
            ...data,
            id: create_uid(),
            created_at: now,
            occurred_at: data.occurred_at ?? now,
            note: data.note ?? "",
        };

        validateTransaction(transaction);
        return await this.storage.insert(transaction);
    }

    public async updateTransaction(
        id: UniqueId,
        patch: TransactionPatch,
    ): Promise<Transaction> {
        const current = await this.storage.findById(id);

        if (!current) {
            throw new TransactionNotFound(`Transaction ${id} was not found`);
        }

        const updated: Transaction = {
            ...current,
            amount: patch.amount ?? current.amount,
            occurred_at: patch.occurred_at ?? current.occurred_at,
            note: patch.note ?? current.note,
        };

        validateTransaction(updated);
        return await this.storage.update(updated);
    }

    public async deleteTransaction(id: UniqueId): Promise<void> {
        await this.storage.delete(id);
    }
}
