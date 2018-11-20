<<<<<<< HEAD
"use strict";

function isEmptyObject (obj) {
    return (Object.keys(obj).length === 0 && obj.constructor === Object);
}

// Clean AMP URLs
function clean_amp(url) {
    var new_url = new URL(url);
    console.debug("clean_amp before: " + url.href);
    var regex = /\/amp/gi;
    new_url.href = url.href.replace(regex, '');

    var params = url.searchParams;
    var new_params = new URLSearchParams(params);
    for (let p of params.keys()) {
        if (p === "amp") {
            new_params.delete(p);
            new_url.search = new_params.toString();
            break;
        }
    }

    console.debug("clean_amp after: " + new_url.href);
    return new_url;
}

// Filter out utm_* query parameters

// callback triggered by new tab
function clean_utm_req(requestDetails) {
    var url = requestDetails.url;
    return clean_utm(url);
}

function clean_utm(old_url) {
    var url = new URL(old_url);
    console.debug("[clean_utm] got " + url);
    var ret_val = {'redirectUrl': ''};

    if (url.search.length > 0) {
        var params = url.searchParams;
        var new_params = new URLSearchParams(params);
        var needs_redirect = false;
        for (let p of params.keys()) {
            if (p.startsWith("utm_")) {
                needs_redirect = true;
                new_params.delete(p);
            }
        }

        if (needs_redirect) {
            console.debug("[clean_utm] needs redirect!!");
            url.search = new_params.toString();
            ret_val = {redirectUrl: url.href};
        }

        // clean AMP url
        // this should stay somewhere else
        // cleaner listeners should be serialized
        if (settings['clean_amp_links'] === true) {
            console.debug("AMP cleaning ACTIVE");
            var cleaned_url = clean_amp(url);
            if (cleaned_url.href !== url.href) {
                ret_val = {redirectUrl: cleaned_url.href};
            }
        } else {
            console.debug("AMP cleaning DISABLED");
        }

    }

    console.debug("[clean_utm] returning " , ret_val['redirectUrl']);
    return ret_val;
}

function build_query_param_remover(shouldRemove) {
    return function (requestDetails) {
        var url = new URL(requestDetails.url);
        if (url.search.length > 0) {
            var params = url.searchParams;
            var new_params = new URLSearchParams(params);
            var needs_redirect = false;
            for (let p of params.keys()) {
                if (shouldRemove(p)) {
                    needs_redirect = true;
                    new_params.delete(p);
                    //console.log("nuked query param", p);
                }
            }
            if (needs_redirect) {
                var new_url = new URL(url);
                new_url.search = new_params.toString();
                return { redirectUrl: new_url.href };
            }
        }
        return {};
    };
}

=======
function build_query_param_remover(shouldRemove) {
    return function (requestDetails) {
        var url = new URL(requestDetails.url);
        if (url.search.length > 0) {
            var params = url.searchParams;
            var new_params = new URLSearchParams(params);
            var needs_redirect = false;
            for (let p of params.keys()) {
                if (shouldRemove(p)) {
                    needs_redirect = true;
                    new_params.delete(p);
                    //console.log("nuked query param", p);
                }
            }
            if (needs_redirect) {
                var new_url = new URL(url);
                new_url.search = new_params.toString();
                return { redirectUrl: new_url.href };
            }
        }
        return {};
    };
}

>>>>>>> master
function wildcard_matches_any(patterns) {
    var re_patterns = patterns.map(function(pat) { return pat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace("\\*", ".+"); });
    return function(p) {
        return re_patterns.some(function(pat) { return (new RegExp(pat)).test(p); });
    };
}

// Filter out utm_* query parameters
var clean_utm = build_query_param_remover(function(p) { return p.startsWith("utm_") });
browser.webRequest.onBeforeRequest.addListener(
<<<<<<< HEAD
    clean_utm_req,
    {urls: ["<all_urls>"],
     types:["main_frame"]},
    ["blocking"]
=======
    clean_utm, {
        urls: ["<all_urls>"],
        types: ["main_frame"]
    }, ["blocking"]
);

var clean_fbclid = build_query_param_remover(function(p) { return p == "fbclid" });
browser.webRequest.onBeforeRequest.addListener(
    clean_fbclid, {
        urls: ["<all_urls>"],
        types: ["main_frame"]
    }, ["blocking"]
>>>>>>> master
);

var clean_fbclid = build_query_param_remover(function(p) { return p == "fbclid" });
browser.webRequest.onBeforeRequest.addListener(
    clean_fbclid, {
        urls: ["<all_urls>"],
        types: ["main_frame"]
    }, ["blocking"]
);

function clean_amazon_req(requestDetails) {
    var url = requestDetails.url;
    return clean_amazon(url);
}

function clean_amazon(url) {
    // console.debug('Entering clean_amazon -- got url: ' + url);
    var new_url = document.createElement('a');
    let slash_d_index = url.indexOf("/d");
    let slash_ref_index = url.indexOf("/ref=", slash_d_index + 2);
    if (slash_ref_index > 0 && url.length > slash_ref_index + 1) {
        new_url.href = url.substring(0, slash_ref_index + 1);
        if (new_url.href != url) {   // try to avoid infinite redirect loops that might arise
            console.warn('Is something strange happening?');
            console.debug("Redirecting from: ", url, "\nto: ", new_url.href);
            // TODO: return {redirectUrl: new_url.href};
        }
    } else {
        url = new URL(url);
        if (url.search.length > 0) {
            url.search = "";
            new_url.href = url.href;
        }
    }

    // scrap SEO friendly text
    var dp_idx = new_url.pathname.indexOf('/dp');
    if (dp_idx > 0) {
        console.debug('Stripping out SEO stuff: ' + new_url.pathname);
        new_url.pathname = new_url.pathname.substring(dp_idx, new_url.pathname.length);
    }

    console.debug("final url is: " + new_url.href);
    return { redirectUrl: new_url.href };
}

browser.webRequest.onBeforeRequest.addListener(
<<<<<<< HEAD
    clean_amazon_req,
    {urls: amazon_regexp,
     types: ["main_frame"]
=======
    clean_amazon,
    // note: "the wildcard may only appear at the start"
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns
    {
        urls: [
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
        ],
        types: ["main_frame"]
>>>>>>> master
    }, ["blocking"]
);


var remove_alisearchparams = build_query_param_remover(function (p) { return true });

browser.webRequest.onBeforeRequest.addListener(
    remove_alisearchparams,
    {
        urls: [
            "*://*.aliexpress.com/item/*.html*",
            "*://*.aliexpress.com/store/product/*.html*",
        ],
        types: ["main_frame"]
    }, ["blocking"]
);

var remove_fbcontentparam = build_query_param_remover(function (p) { return p == "efg" });
browser.webRequest.onBeforeRequest.addListener(
    remove_fbcontentparam,
    {
        urls: [
            "*://*.fbcdn.net/*",
        ], types: ["main_frame"]
    }, ["blocking"]
);

function build_redirect_to_query_param(query_param_name) {
    const redirect_to_get_param = function (requestDetails) {
        const search_params = new URLSearchParams(new URL(requestDetails.url).search);
        const real_url_from_param = search_params.get(query_param_name);
        if (real_url_from_param) {
            //console.log('Redirecting to ' + real_url_from_param);
            return { redirectUrl: real_url_from_param };
        }
        return { redirectUrl: '' };
    }
    return redirect_to_get_param;
}

const urls_to_param_mappers = [
    {
        urls: ["*://l.facebook.com/*", "*://lm.facebook.com/*"],
        param_name: 'u'
    },
    {
        urls: ["*://out.reddit.com/*"]
    },
    {
        urls: ["*://steamcommunity.com/linkfilter/*"]
    },
    {
        urls: ["*://l.instagram.com/*"],
        param_name: 'u'
    },
    {
        urls: ["*://t.umblr.com/*"],
        param_name: 'z'
    },
    {
        urls: ["*://sys.4chan.org/derefer?*"]
    },
    {
        urls: ["*://www.youtube.com/redirect?*"],
        param_name: 'q'
    },
];

// Google's outbound redirect is weird so it has its own function here
function bypass_google_redirect(requestDetails) {
  const search_params = new URLSearchParams(new URL(requestDetails.url).search);
  var real_url_from_param = search_params.get("q") ? search_params.get("url") : null;
  if (real_url_from_param) {
    //console.log('Redirecting to ' + real_url_from_param);
    return { redirectUrl: real_url_from_param };
  }
}
<<<<<<< HEAD

=======
>>>>>>> master
browser.webRequest.onBeforeRequest.addListener(
  bypass_google_redirect, {
    urls: ["*://*.google.com/url*"],
    types: ["main_frame"]
  }, ["blocking"]
);

urls_to_param_mappers.forEach(function(listenerConfig) {
    const param_name = listenerConfig.param_name ? listenerConfig.param_name : 'url';
    // console.debug('Mapping ' + listenerConfig.urls + ' to param name ' + param_name);
    browser.webRequest.onBeforeRequest.addListener(
        build_redirect_to_query_param(param_name), {
            urls: listenerConfig.urls,
            types: ["main_frame"]
        }, ["blocking"]
    );
});
