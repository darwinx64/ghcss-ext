const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const resolve = require("path").resolve;

function getPathEntries(pattern) {
    return glob.sync(pattern).reduce((acc, filePath) => {
        if (!filePath.includes("node_modules")) {
            const entryName = path.relative("./src", filePath).replace(/\.[^/.]+$/, "");
            acc[entryName] = path.resolve(filePath);
        }
        return acc;
    }, {});
}

function convertToFirefoxManifest(manifest) {
    return { ...manifest, background: { page: "background_ff.html" } };
}

module.exports = (env) => {
    const mode = env.mode || "dev";

    return {
        mode: mode === 'dev' ? 'development' : 'production',
        entry: {
            ...getPathEntries("./src/background.ts"),
            ...getPathEntries("./src/popup.ts"),
            ...getPathEntries("./src/popup.css"),
            ...getPathEntries("./src/**/*.js"),
            ...getPathEntries("./src/lib/**/*.ts")
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].js"
        },
        resolve: {
            extensions: [".ts", ".js", ".html"],
            alias: {
                src: path.resolve(__dirname, "src")
            }
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                    exclude: /node_modules|\.d\.ts$/,
                },
                {
                    test: /\.d\.ts$/,
                    loader: "ignore-loader",
                },
                {
                    test: new RegExp(`.(css)$`),
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                    },
                    exclude: /node_modules/,
                },
                {
                    test: /environment\.ts$/,
                    loader: "file-replace-loader",
                    options: {
                        condition: mode === "development",
                        replacement: resolve('./src/environment.dev.ts'),
                    },
                },
            ]
        },
        plugins: [
            new webpack.SourceMapDevToolPlugin({}),
            new CopyPlugin({
                patterns: [
                    { from: "icons", to: "icons", context: "." },
                    { from: "src/popup.css", to: ".", context: "." },
                    { from: "src/popup.html", to: ".", context: "." },
                    { from: "src/background_ff.html", to: ".", context: "." },
                    { from: "README.md", to: ".", context: "." },
                    {
                        from: "manifest.json", to: "manifest.json",
                        transform(raw) {
                            let processed = JSON.parse(raw.toString());

                            if (mode === "dev") {
                                processed.host_permissions.push("http://localhost:5296/*");
                            }

                            if (env.browser === "firefox") {
                                processed = convertToFirefoxManifest(processed);
                            }

                            return JSON.stringify(processed, null, 2);
                        }
                    }
                ]
            })
        ],
        stats: {
            errorDetails: true,
            colors: true
        },
        optimization: {
            usedExports: true
        }
    }
}
