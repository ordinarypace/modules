/**
 * @author Jang Jeong Sik (django)
 * @module webpack base config
 */

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const root = process.cwd();

// base resources
const base = {
    devtool : 'inline-source-map',
    context : root + '/src',
    entry : root + '/src/index.js'
};

const output = {
    filename : 'bundle.js',
    path :  __dirname + '/../public/'
};

// webpack base configuration
const config = function(){
    return {
        context : base.context,
        entry : base.entry,
        output : output,
        plugins : [

            //// inject options of common loader
            new webpack.LoaderOptionsPlugin({
                minimize : true,
                debug : true,
                options : {
                    context : base.context + '/app',
                    babel : {
                        // code splitting { modules : false }
                        presets : [['es2015', {'loose' : true, 'modules' : false}, 'env', {targets : {'ie' : 9}}]],
                        plugins : ['es6-promise'],
                        comments : false
                    }
                }
            }),

            new ExtractTextPlugin('swipe.css')
        ],
        module : {
            rules : [
                {
                    test : /\.js$/,
                    exclude : /node_modules/,
                    loader : 'babel-loader'
                },
                {
                    test : /\.scss/,
                    use : ExtractTextPlugin.extract({
                        fallback : 'style-loader',
                        use: "css-loader!sass-loader"
                    })
                }
            ]
        }
    }
};

// remove logs for loader developers
process.noDeprecation = true;

module.exports = config;