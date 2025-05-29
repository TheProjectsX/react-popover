import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import babel from "@rollup/plugin-babel";

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.jsx",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: true,
                exports: "named",
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
                exports: "named",
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            terser(),
            postcss(),
            babel({
                babelHelpers: "bundled",
                exclude: "node_modules/**",
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            }),
        ],
        external: ["react", "react-dom"],
    },
];
