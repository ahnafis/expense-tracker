import { getDefaultConfig } from "expo/metro-config.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const config_dir = dirname(fileURLToPath(import.meta.url));

const config = getDefaultConfig(config_dir);

config.resolver.sourceExts.push("sql");

export default config;
