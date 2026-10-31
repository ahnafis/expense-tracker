import {
    InvalidAmount,
    TransactionKind,
    TransactionNotFound,
    TransactionService,
} from "@/features/tracker";

import { InMemoryTransactionStorage } from "./in-memory-db";

import { beforeEach, describe, expect, test } from "vitest";
import { MOCK_TRANSACTIONS } from "./data";

describe("TransactionService", () => {
    let storage: InMemoryTransactionStorage;
    let service: TransactionService;

    beforeEach(() => {
        storage = new InMemoryTransactionStorage(
            structuredClone(MOCK_TRANSACTIONS),
        );

        service = new TransactionService(storage);
    });

    describe("Read", () => {
        test("Should list all the transactions", async () => {
            const transactions = await service.listTransactions();

            expect(transactions).toHaveLength(6);
            expect(transactions).toStrictEqual(MOCK_TRANSACTIONS.toReversed());
        });

        test("Should list a specific transaction", async () => {
            const transactions = await service.listTransactions({
                occurred_from: 3000,
            });

            expect(transactions.length).toStrictEqual(4);
        });

        test("Should return a transaction by ID", async () => {
            const transaction = await service.getTransactionById(3);
            expect(transaction).toStrictEqual(MOCK_TRANSACTIONS[2]);
        });

        test("Should return undefined for a nonexistent ID", async () => {
            const transaction = await service.getTransactionById(999);
            expect(transaction).toBeUndefined();
        });
    });

    describe("Create", () => {
        test("Should create a new transaction", async () => {
            const transaction = await service.createTransaction({
                amount: 20,
                kind: TransactionKind.EXPENSE,
            });

            expect(transaction.amount).toStrictEqual(20);
            expect(transaction.kind).toStrictEqual(TransactionKind.EXPENSE);
            expect(transaction.note).toStrictEqual("");

            const stored = await service.getTransactionById(transaction.id);
            expect(stored).toStrictEqual(transaction);
        });

        test("Should generate ID and timestamps", async () => {
            const before = Date.now();

            const transaction = await service.createTransaction({
                amount: 100,
                kind: TransactionKind.INCOME,
            });

            const after = Date.now();

            expect(transaction.id).toBeDefined();
            expect(transaction.created_at).toBeGreaterThanOrEqual(before);
            expect(transaction.created_at).toBeLessThanOrEqual(after);
            expect(transaction.occurred_at).toStrictEqual(
                transaction.created_at,
            );
        });

        test.each([0, -1, NaN, Infinity, -Infinity])(
            "Should reject invalid amount: %s",
            async amount => {
                await expect(
                    service.createTransaction({
                        amount,
                        kind: TransactionKind.INCOME,
                    }),
                ).rejects.toThrow(InvalidAmount);
            },
        );

        test("Should preserve a custom occurrence timestamp", async () => {
            const occurred_at = 500;

            const transaction = await service.createTransaction({
                amount: 100,
                kind: TransactionKind.INCOME,
                occurred_at,
            });

            expect(transaction.occurred_at).toBe(occurred_at);
            expect(transaction.created_at).not.toBe(occurred_at);
        });
    });

    describe("Update", () => {
        test("Should update a transaction without changing other fields", async () => {
            const original = await service.getTransactionById(2);
            const new_note = "I love chips";

            const updated = await service.updateTransaction(2, {
                note: new_note,
            });

            expect(updated.note).toBe(new_note);
            expect(updated.amount).toBe(original?.amount);
            expect(updated.kind).toBe(original?.kind);
            expect(updated.occurred_at).toBe(original?.occurred_at);
            expect(updated.created_at).toBe(original?.created_at);
        });

        test("Should update multiple fields", async () => {
            const updated = await service.updateTransaction(2, {
                amount: 2500,
                kind: TransactionKind.INCOME,
                note: "Updated transaction",
            });

            expect(updated.amount).toBe(2500);
            expect(updated.kind).toBe(TransactionKind.INCOME);
            expect(updated.note).toBe("Updated transaction");
        });

        test("Should reject updating a nonexistent transaction", async () => {
            const updated = service.updateTransaction(999, {
                note: "Nothing here",
            });
            await expect(updated).rejects.toThrow(TransactionNotFound);
        });
    });

    describe("Delete", () => {
        test("Should delete a transaction", async () => {
            await service.deleteTransaction(6);

            expect(await service.getTransactionById(6)).toBeUndefined();

            const transactions = await service.listTransactions();
            expect(transactions).toHaveLength(5);
        });

        test("Should silently ignore deletion of a nonexistent transaction", async () => {
            await expect(
                service.deleteTransaction(999),
            ).resolves.toBeUndefined();

            expect(await service.listTransactions()).toHaveLength(6);
        });
    });

    test("Should calculate total balance", async () => {
        expect(await service.getBalance()).toStrictEqual(4400);
    });

    test("Should generate summary", async () => {
        const summary = await service.getSummary();

        expect(summary.net).toBe(4400);
        expect(summary.income).toBe(5000);
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
