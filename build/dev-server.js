const config = require('./webpack.config')
const path = require("path")
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')

const app = express()
const compiler = webpack(config)


const devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: '/static/dist/',
	stats: {
		colors: true,
		chunks: false
	}
})

app.use(devMiddleware)
app.use(proxyMiddleware('**', {target: 'http://localhost:8000'}))

module.exports = app.listen(8080, function (err) {
	if (err) {
		console.log(err)
		return
	}
	console.log('Listening at http://localhost:8080\n')
})
