import * as vitest from "vitest/config";

const vitest_config = vitest.defineConfig({
    test: { environment: "node" },
    resolve: { tsconfigPaths: true },
});

export default vitest_config;
