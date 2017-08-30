/**
 * @author Jang Jeong Sik (django)
 * @module webpack config
 */

const env = process.env.NODE_ENV || 'development';

const build = function(){
    return require(['./webpack.', env, '.js'].join(''))();
};

module.exports = build();