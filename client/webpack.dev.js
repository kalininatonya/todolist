const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', //Входная точка - файлы, которые вебпак будет компилировать.
    output: {
        path: path.resolve(__dirname, 'public'), //Точка выхода - директория, в которую помещаются скомпилированные вебпаком файлы.
        filename: 'index_bundle.js',
    },
    mode: 'development',
    //Recommended size limit (244 KiB)(для mode: 'production').
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            // JavaScript
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            // Правило для CSS
            {
                test: /\.(sass|css|scss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            // шрифты и SVG
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            }
        ]
    },
    experiments: {
        topLevelAwait: true
    },
    devServer: {
        // Здесь указывается вся статика, которая будет на нашем сервере
        static: {
            directory: path.join(__dirname, 'public'),
        },
        open: true,
        // Сжимать ли бандл при компиляции
        compress: true,
        // Порт на котором будет наш сервер
        port: 8080,
        client: {
            // Показывает ошибки при компиляции в самом браузере
            overlay: {
                // Ошибки
                errors: true,
                // Предупреждения
                warnings: true,
            },
            // Показывает прогесс компиляции
            progress: true
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/list.html',
            filename: 'index.html', // название выходного файла
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/icons/favicon.ico',
                    to: path.join(__dirname, 'public'),
                    noErrorOnMissing: true
                }
            ],
        }),
    ],

}