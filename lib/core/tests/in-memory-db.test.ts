import { InMemoryTransactionStorage } from "./in-memory-db";

import { beforeEach, describe, expect, test } from "vitest";
import { MOCK_TRANSACTIONS } from "./data";

describe("InMemoryTransactionStorage", () => {
    let storage: InMemoryTransactionStorage;

    beforeEach(() => {
        storage = new InMemoryTransactionStorage(MOCK_TRANSACTIONS);
    });

    test("Should not expose internal references through findById", async () => {
        const transaction = await storage.findById(1);
        if (!transaction) throw new Error("Transaction not found");

        transaction.amount = 999999;

        const stored = await storage.findById(1);
        expect(stored?.amount).toStrictEqual(5000);
    });

    test("Should not expose internal references through find", async () => {
        const transactions = await storage.find();
        transactions[0].amount = 999999;

        const stored = await storage.findById(6);
        expect(stored?.amount).toStrictEqual(400);
    });
});
