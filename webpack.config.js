
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('node:path');

module.exports = (env) => ({
    mode: (env['mode'] ?? 'development'),
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin(),
    ],
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
        ignored: ['**/node_modules', './dist']
    },
});