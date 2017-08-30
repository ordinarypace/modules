'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _banners = require('../controllers/banners.controller');

exports.default = function (router) {
    router.get('/banners', _banners.fetch);
};