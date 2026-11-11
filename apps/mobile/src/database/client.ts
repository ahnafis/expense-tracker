import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

export const sqlite = SQLite.openDatabaseSync("expense-tracker.db");

export const db = drizzle(sqlite);
