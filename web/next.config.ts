import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const configDirectory = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: configDirectory,
};

export default nextConfig;
