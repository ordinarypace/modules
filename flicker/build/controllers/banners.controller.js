"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var bannersDesktopData = [{
    "image": "//cdn.lezhin.com/v2/inventory_items/4537033910124544/media/upperBanner",
    "link": "/ko/page/sale1704W1_ALL"
}, {
    "image": "//cdn.lezhin.com/v2/inventory_items/6272864723140608/media/upperBanner",
    "link": "/ko/payment"
}, {
    "image": "//cdn.lezhin.com/v2/inventory_items/5439666241929216/media/upperBanner",
    "link": "/ko/comic/dalbox"
}, {
    "image": "//cdn.lezhin.com/v2/inventory_items/6120926790549504/media/upperBanner",
    "link": "/ko/novel/leviathan"
}];

var bannersMobileData = [{
    "image": "//cdn.lezhin.com/v2/inventory_items/5439666241929216/media/upperBannerMobile",
    "link": "/ko/comic/dalbox"
}, {
    "image": "//cdn.lezhin.com/v2/inventory_items/6120926790549504/media/upperBannerMobile",
    "link": "/ko/novel/leviathan"
}, {
    "image": "//cdn.lezhin.com/v2/inventory_items/4537033910124544/media/upperBannerMobile",
    "link": "/ko/page/sale1704W1_ALL"
}, {
    "image": "//cdn.lezhin.com/v2/inventory_items/6272864723140608/media/upperBannerMobile",
    "link": "/ko/payment"
}];
var fetch = exports.fetch = function fetch(req, res) {
    if (!req.query.device) res.send('Query String Error');

    var device = req.query.device;
    var count = parseInt(req.query.count);
    var result = device === 'mobile' ? bannersMobileData.slice(0, count) : bannersDesktopData.slice(0, count);

    res.json(result);
};