import { beforeEach, describe, expect, test } from "vitest";

import { TransactionKind, type Transaction } from "@/features/tracker/entities";
import { TransactionService } from "@/features/tracker/services";

import { InMemoryTransactionStorage } from "./in-memory-db";

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 1,
        created_at: 1000,
        occurred_at: 1000,
        amount: 5000,
        kind: TransactionKind.INCOME,
        source: "Salary",
        note: "Monthly salary",
    },

    {
        id: 2,
        created_at: 2000,
        occurred_at: 2000,
        amount: 1200,
        kind: TransactionKind.EXPENSE,
        category: "Food",
        note: "Groceries",
    },

    {
        id: 3,
        created_at: 3000,
        occurred_at: 3000,
        amount: 800,
        kind: TransactionKind.LEND,
        party: "Rahim",
        note: "Loan to friend",
    },

    {
        id: 4,
        created_at: 4000,
        occurred_at: 4000,
        amount: 1500,
        kind: TransactionKind.BORROW,
        party: "Karim",
        note: "Borrowed cash",
    },

    {
        id: 5,
        created_at: 5000,
        occurred_at: 5000,
        amount: 300,
        kind: TransactionKind.REPAY_IN,
        party: "Rahim",
        note: "Rahim paid back",
    },

    {
        id: 6,
        created_at: 6000,
        occurred_at: 6000,
        amount: 400,
        kind: TransactionKind.REPAY_OUT,
        party: "Karim",
        note: "Paid back Karim",
    },
];

describe("Testing storage functions with InMemoryTransactionStorage", () => {
    let storage: InMemoryTransactionStorage;
    let service: TransactionService;

    beforeEach(() => {
        storage = new InMemoryTransactionStorage(
            structuredClone(MOCK_TRANSACTIONS),
        );

        service = new TransactionService(storage);
    });

    test("Should calculate total balance", async () => {
        expect(await service.getBalance()).toStrictEqual(4400);
    });

    test("Should generate summary", async () => {
        const summary = await service.getSummary();

        expect(summary.net).toBe(4400);
        expect(summary.income).toBe(5000);
    });

    test("Should list all the transactions", async () => {
        const transactions = await service.listTransactions();

        expect(transactions.length).toStrictEqual(6);
        expect(transactions).toStrictEqual(MOCK_TRANSACTIONS.reverse());
    });

    test("Should create a new transaction", async () => {
        await service.createTransaction({
            amount: 20,
            kind: TransactionKind.EXPENSE,
            category: "Phone",
        });
    });

    test("Should reject invalid amount", async () => {
        const transaction = service.createTransaction({
            amount: 0,
            kind: TransactionKind.INCOME,
            source: "Gift",
        });

        await expect(transaction).rejects.toThrow();
    });

    test("Should update a transactions", async () => {
        const updated = await service.updateTransaction(2, {
            note: "I love chips",
        });

        const transaction = await service.getTransactionById(2);

        expect(transaction).toStrictEqual(updated);
    });

    test("Should delete a transaction", async () => {
        await service.deleteTransaction(6);
        const transactions = await service.listTransactions();

        expect(transactions.length).toStrictEqual(5);
    });
});

describe("Empty storage", () => {
    const storage = new InMemoryTransactionStorage([]);
    const service = new TransactionService(storage);

    test("Should generate a report even on empty storage", async () => {
        const summary = await service.getSummary();

        expect(await service.getBalance()).toBe(summary.net);
    });
});
