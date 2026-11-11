import { mock_data } from "@/features/tracker/fixtures";

import { SQLiteStorage } from "./storage";

const storage = new SQLiteStorage();

export async function seedDatabase(): Promise<void> {
    const existing = await storage.find();

    if (existing.length > 0) {
        return;
    }

    for (const transaction of mock_data) {
        await storage.insert(transaction);
    }
}
