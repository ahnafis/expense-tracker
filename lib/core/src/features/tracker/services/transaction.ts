import {
    InvalidAmount,
    type Transaction,
    type TransactionFilter,
    TransactionKind,
    TransactionNotFound,
} from "../entities";

import type { TransactionStorage } from "../storage";

import type { TimeStamp, UniqueId } from "@/types";
import { create_uid } from "@/utils";

type TransactionInput = {
    amount: number;
    kind: TransactionKind;
    occurred_at?: TimeStamp;
    note?: string;
};

type TransactionPatch = Partial<TransactionInput>;

export class TransactionSummary {
    constructor(
        public income = 0,
        public expense = 0,
        public lend = 0,
        public repay_in = 0,
        public borrow = 0,
        public repay_out = 0,
        public net = 0,
    ) {}
}

interface TransactionServiceInterface {
    getBalance(): Promise<number>;
    getSummary(): Promise<TransactionSummary>;

    listTransactions(filter?: TransactionFilter): Promise<Transaction[]>;
    getTransactionById(id: UniqueId): Promise<Transaction | undefined>;

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
        case TransactionKind.BORROW:
        case TransactionKind.REPAY_IN:
            return transaction.amount;

        case TransactionKind.EXPENSE:
        case TransactionKind.LEND:
        case TransactionKind.REPAY_OUT:
            return -transaction.amount;
    }
}

function validateTransaction(data: TransactionInput): void {
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
        throw new InvalidAmount("Amount must be positive");
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

    public listTransactions(
        filter?: TransactionFilter,
    ): Promise<Transaction[]> {
        return this.storage.find(filter);
    }

    public getTransactionById(id: UniqueId): Promise<Transaction | undefined> {
        return this.storage.findById(id);
    }

    public async createTransaction(
        data: TransactionInput,
    ): Promise<Transaction> {
        const now = Date.now();

        const transaction: Transaction = {
            id: create_uid(),
            created_at: now,
            amount: data.amount,
            kind: data.kind,
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

        const updated: Transaction = { ...current, ...patch };

        validateTransaction(updated);
        return await this.storage.update(updated);
    }

    public deleteTransaction(id: UniqueId): Promise<void> {
        return this.storage.delete(id);
    }
}
