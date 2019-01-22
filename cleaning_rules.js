"use strict";

// note: "the wildcard may only appear at the start"
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns
var amazon_regexp = [
    "*://*.amazon.com/d/*",
    "*://*.amazon.ca/d/*",
    "*://*.amazon.co.jp/d/*",
    "*://*.amazon.co.uk/d/*",
    "*://*.amazon.cn/d/*",
    "*://*.amazon.de/d/*",
    "*://*.amazon.fr/d/*",
    "*://*.amazon.in/d/*",
    "*://*.amazon.it/d/*",
    "*://*.amazon.com.mx/d/*",
    "*://*.amazon.com.au/d/*",
    "*://*.amazon.com.br/d/*",

    // dp = detail product
    "*://*.amazon.com/dp/*",
    "*://*.amazon.ca/dp/*",
    "*://*.amazon.co.jp/dp/*",
    "*://*.amazon.co.uk/dp/*",
    "*://*.amazon.cn/dp/*",
    "*://*.amazon.de/dp/*",
    "*://*.amazon.fr/dp/*",
    "*://*.amazon.in/dp/*",
    "*://*.amazon.it/dp/*",
    "*://*.amazon.com.mx/dp/*",
    "*://*.amazon.com.au/dp/*",
    "*://*.amazon.com.br/dp/*",

    // gp = General Product
    "*://*.amazon.com/gp/aw/d/*",
    "*://*.amazon.ca/gp/aw/d/*",
    "*://*.amazon.co.jp/gp/aw/d/*",
    "*://*.amazon.co.uk/gp/aw/d/*",
    "*://*.amazon.cn/gp/aw/d/*",
    "*://*.amazon.de/gp/aw/d/*",
    "*://*.amazon.fr/gp/aw/d/*",
    "*://*.amazon.in/gp/aw/d/*",
    "*://*.amazon.it/gp/aw/d/*",
    "*://*.amazon.com.mx/gp/aw/d/*",
    "*://*.amazon.com.au/gp/aw/d/*",
    "*://*.amazon.com.br/gp/aw/d/*",

    // SEO friendly descriptiion + detail product
    "*://*.amazon.com/*/dp/*",
    "*://*.amazon.ca/*/dp/*",
    "*://*.amazon.co.jp/*/dp/*",
    "*://*.amazon.co.uk/*/dp/*",
    "*://*.amazon.cn/*/dp/*",
    "*://*.amazon.de/*/dp/*",
    "*://*.amazon.fr/*/dp/*",
    "*://*.amazon.in/*/dp/*",
    "*://*.amazon.it/*/dp/*",
    "*://*.amazon.com.mx/*/dp/*",
    "*://*.amazon.com.au/*/dp/*",
    "*://*.amazon.com.br/*/dp/*",

    "*://*.amazon.com/gp/product/*",
    "*://*.amazon.ca/gp/product/*",
    "*://*.amazon.co.jp/gp/product/*",
    "*://*.amazon.co.uk/gp/product/*",
    "*://*.amazon.cn/gp/product/*",
    "*://*.amazon.de/gp/product/*",
    "*://*.amazon.fr/gp/product/*",
    "*://*.amazon.in/gp/product/*",
    "*://*.amazon.it/gp/product/*",
    "*://*.amazon.com.mx/gp/product/*",
    "*://*.amazon.com.au/gp/product/*",
    "*://*.amazon.com.br/gp/product/*",
];

var aliexpress_regexp = [
    "*://*.aliexpress.com/item/*.html*",
    "*://*.aliexpress.com/store/product/*.html*",
];

var amp_regexp = [
    "*://*/amp/*",
];

var all_urls = [
    "*://*"
];

var fbcontent_regexp = [
    "*://*.fbcdn.net/*",
];

// query params matching

var f_match_utm = p => p.startsWith("utm_");
var f_match_all = p => true;
var f_match_fbclid = p => p == "fbclid";
var f_match_fbcontent = p => p == "efg";
