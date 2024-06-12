const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

function getPathEntries(path) {
    return glob.sync(path).reduce((acc, e) => {
        return acc;
    }, {});
}

function convertToFirefoxManifest(manifest) {
    const copy = Object.assign({}, manifest);

    copy.background = {
        page: "background_ff.html"
    }

    return copy;
}

module.exports = (env) => {
    const mode = env.mode || "dev";

    return {
        mode: "none",
        entry: Object.assign(
            getPathEntries("./src/*.js")
        ),
        output: {
            path: path.join(__dirname, "dist"),
            filename: "[name].js"
        },
        resolve: {
            extensions: [".js", ".html"]
        },
        module: {
            rules: [
                {
                    test: new RegExp(`.(css)$`),
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    },
                    exclude: /node_modules/,
                }
            ]
        },
        plugins: [
            new webpack.SourceMapDevToolPlugin({}),
            new HtmlWebpackPlugin({
                title: "ghcss",
                template: "src/popup.html"
            }),
            new CopyPlugin({
                patterns: [
                    { from: "icons", to: "icons", context: "." },
                    { from: "styles/*", to: ".", context: "./src" },
                    { from: "scripts/*", to: ".", context: "./src" },
                    { from: "src/background_ff.html", to: ".", context: "." },
                    {
                        from: "manifest.json", to: "manifest.json",
                        transform(raw) {
                            let processed = JSON.parse(raw.toString());

                            if (env.browser === "firefox") {
                                processed = convertToFirefoxManifest(processed);
                            }

                            return JSON.stringify(processed, null, 2);
                        }
                    }
                ]
            })
        ]
    }
}