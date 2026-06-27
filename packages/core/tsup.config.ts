import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "widgets/index": "src/widgets/index.ts",
    "widgets/recharts/index": "src/widgets/recharts/index.ts",
    "widgets/hierarchy/index": "src/widgets/hierarchy/index.ts",
    "widgets/kpi/index": "src/widgets/kpi/index.ts",
    "hooks/index": "src/hooks/index.ts",
    "store/index": "src/store/index.ts",
    "utils/http-client": "src/utils/http-client.ts",
    "utils/index": "src/utils/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  external: [
    "react",
    "react-dom",
    "recharts",
    "framer-motion",
  ],
  clean: true,
  treeshake: true,
  sourcemap: true,
  target: "es2020",
  jsx: "react-jsx",
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
