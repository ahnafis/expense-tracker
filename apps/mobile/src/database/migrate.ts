import { migrate } from "drizzle-orm/expo-sqlite/migrator";

import { db } from "./client";
import migrations from "./migrations/migrations";
import { useEffect, useState } from "react";
import { seedDatabase } from "./seed";

export function migrateDatabase() {
    return migrate(db, migrations);
}

export function useMigration() {
    const [is_ready, setIsReady] = useState(false);
    const [error, setError] = useState<unknown>(undefined);

    useEffect(() => {
        async function initialize() {
            try {
                await migrateDatabase();

                if (__DEV__) {
                    await seedDatabase();
                }

                setIsReady(true);
            } catch (error: unknown) {
                setError(error);
            }
        }

        void initialize();
    }, []);

    return { is_ready, error };
}
