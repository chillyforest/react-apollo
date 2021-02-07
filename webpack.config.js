const path = require("path");

module.exports = {
    entry: "./src/index.js",
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },{
            test: /\.css$/,
            use: ["style-loader", "css-loder"]
        }
        ]
    },
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    devServer: {
        contentBase: __dirname,
        historyApiFallback: true
    }
}