import type { TransactionKind } from "@lib/core/features/tracker";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

const transactions = sqliteTable("transactions", {
    id: integer("id").primaryKey(),
    created_at: integer("created_at").notNull(),
    amount: integer("amount").notNull(),
    kind: text("kind").$type<TransactionKind>().notNull(),
    occurred_at: integer("occurred_at").notNull(),
    note: text("note").notNull(),
});

export { transactions };
