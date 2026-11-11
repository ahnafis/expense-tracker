import { type SQL, and, eq, gte, lte, like } from "drizzle-orm";

import type {
    Transaction,
    TransactionFilter,
    TransactionStorage,
} from "@lib/core/features/tracker";
import type { UniqueId } from "@lib/core/types";

import { db } from "./client";
import { transactions } from "./schema";

export class SQLiteStorage implements TransactionStorage {
    public async find(filter?: TransactionFilter): Promise<Transaction[]> {
        const conditions: SQL[] = [];

        if (filter?.id !== undefined) {
            conditions.push(eq(transactions.id, filter.id));
        }

        if (filter?.kind !== undefined) {
            conditions.push(eq(transactions.kind, filter.kind));
        }

        if (filter?.created_from !== undefined) {
            conditions.push(gte(transactions.created_at, filter.created_from));
        }

        if (filter?.created_until !== undefined) {
            conditions.push(lte(transactions.created_at, filter.created_until));
        }

        if (filter?.occurred_from !== undefined) {
            conditions.push(
                gte(transactions.occurred_at, filter.occurred_from),
            );
        }

        if (filter?.occurred_until !== undefined) {
            conditions.push(
                lte(transactions.occurred_at, filter.occurred_until),
            );
        }

        if (filter?.min_amount !== undefined) {
            conditions.push(gte(transactions.amount, filter.min_amount));
        }

        if (filter?.max_amount !== undefined) {
            conditions.push(lte(transactions.amount, filter.max_amount));
        }

        if (filter?.note_query) {
            conditions.push(like(transactions.note, `%${filter.note_query}%`));
        }

        const where = conditions.length > 0 ? and(...conditions) : undefined;

        return db.select().from(transactions).where(where);
    }

    public async findById(id: UniqueId): Promise<Transaction | undefined> {
        const result = await db
            .select()
            .from(transactions)
            .where(eq(transactions.id, id))
            .limit(1);

        return result[0];
    }

    public async insert(transaction: Transaction): Promise<Transaction> {
        await db.insert(transactions).values(transaction);
        return transaction;
    }

    public async update(transaction: Transaction): Promise<Transaction> {
        await db
            .update(transactions)
            .set(transaction)
            .where(eq(transactions.id, transaction.id));

        return transaction;
    }

    public async delete(id: UniqueId): Promise<void> {
        await db.delete(transactions).where(eq(transactions.id, id));
    }
}
