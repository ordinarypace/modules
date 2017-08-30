/**
 * @author Jang Jeong Sik (django)
 * @module webpack server config
 */

const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('./webpack.config');
const root = process.cwd();

const compiler = webpack(config);

const server = new webpackDevServer(compiler, {
    //inline : true,
    hot : true,
    port : 3000,
    host : '0.0.0.0',
    disableHostCheck: true,
    historyApiFallback : false,
    contentBase : root + '/public',
    publicPath : '/assets/'
});

server.listen(3000, 'localhost', function(){
    console.log('listened localhost:3000 !!');
});
