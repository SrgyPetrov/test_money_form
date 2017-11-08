const path = require("path");
const webpack = require("webpack")

module.exports = {
	entry: "./core/static/app/app.es",
	output: {
		filename: "app.js",
		path: path.resolve(__dirname, "core/static/dist")
	},
	resolve: {
		modules: [
			path.join(__dirname, "core/static/app"),
			"node_modules"
		]
	},
	module: {
		rules: [
			{
				test: /\.es$/,
				exclude: /node_modules/,
				loader: "eslint-loader",
				enforce: "pre",
				options: {
					"parserOptions": {
						"sourceType": "module",
						"ecmaFeatures": {
							"jsx": true
						}
					},
					"extends": [
						"eslint:recommended",
						"plugin:react/recommended"
					],
					"plugins": [
						"react"
					],
					"rules": {
						"react/jsx-uses-react": "error",
						"react/jsx-uses-vars": "error",
						"indent": ["error", "tab"],
						"no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }]
					},
					"env": {
						"browser": true,
						"es6": true
					}
				}
			},
			{
				test: /\.es$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	}
};
