const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');

module.exports = (env) => {
    const { production } = env;

    const plugins = [
        new HtmlWebpackPlugin({
            template: __dirname + '/index.html',
            filename: 'index.html',
            inject: 'body',
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.config().parsed),
        }),
        new webpack.HotModuleReplacementPlugin(),
    ];

    return {
        entry: './src/index.tsx',
        devtool: 'source-map',
        mode: production ? 'production' : 'development',
        target: ['web', 'es5'],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [['autoprefixer']],
                                },
                            },
                        },
                        'sass-loader',
                    ],
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        plugins,
        optimization: {
            splitChunks: {
                cacheGroups: {
                    default: false,
                    vendors: false,
                    // vendor chunk
                    vendor: {
                        name: 'vendor',
                        // sync + async chunks
                        chunks: 'all',
                        // import file path containing node_modules
                        test: /node_modules/,
                    },
                },
            },
        },
        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            host: 'localhost',
            hot: true,
            port: 3000,
            historyApiFallback: true,
        },
        output: {
            filename: '[name].js',
            chunkFilename: '[id].[chunkhash].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
            publicPath: '/',
        },
    };
};
