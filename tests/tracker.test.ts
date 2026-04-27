import type { Transaction } from "@/features/tracker/entities";
import { describe, expect, test } from "vitest";
import { InMemoryTransactionStorage } from "./in-memory-db";

describe("Testing storage functions with InMemoryTransactionStorage", () => {
    const storage = new InMemoryTransactionStorage([]);

    let mock_expense_1: Transaction;
    let mock_expense_2: Transaction;
    let mock_expense_3: Transaction;

    test("Should add an expense record to the DB", async () => {
        mock_expense_1 = await storage.add({
            occurred_at: Date.now(),
            amount: 40,
            note: "Food",
        });

        mock_expense_2 = await storage.add({
            occurred_at: Date.now(),
            amount: 100,
            note: "Phone recharge",
        });

        mock_expense_3 = await storage.add({
            occurred_at: Date.now(),
            amount: 3000,
            note: "Debt payment",
        });

        expect(await storage.get()).toStrictEqual([
            mock_expense_1,
            mock_expense_2,
            mock_expense_3,
        ]);
    });

    test("Should filter records out", async () => {
        const result = await storage.get({ note_query: "Food" });
        expect(result).toStrictEqual([mock_expense_1]);
    });

    test("Should update a record in the DB", async () => {
        mock_expense_1 = await storage.update(mock_expense_1.id, {
            note: "I love to eat aloooooot",
        });

        mock_expense_2 = await storage.update(mock_expense_2.id, {
            amount: 69,
        });

        expect(await storage.get()).toStrictEqual([
            mock_expense_1,
            mock_expense_2,
            mock_expense_3,
        ]);
    });

    test("Should delete a record from the DB", async () => {
        await storage.delete(mock_expense_1.id);

        expect(await storage.get()).toStrictEqual([
            mock_expense_2,
            mock_expense_3,
        ]);
    });
});
