import * as vite from "vite";
import * as vitest from "vitest/config";

const vite_config = vite.defineConfig({
    server: { port: 1100 },
    preview: { port: 1101 },
    resolve: {
        tsconfigPaths: true,
    },
});

const vitest_config = vitest.defineConfig({
    test: { environment: "node" },
});

export default vite.mergeConfig(vite_config, vitest_config);
