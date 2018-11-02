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

browser.webRequest.onBeforeRequest.addListener(
    clean_utm_req,
    {urls: ["<all_urls>"],
     types:["main_frame"]},
    ["blocking"]
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
    return {redirectUrl: new_url.href};
}

browser.webRequest.onBeforeRequest.addListener(
    clean_amazon_req,
    {urls: amazon_regexp,
     types: ["main_frame"]
    }, ["blocking"]
);


function remove_searchparams(requestDetails) {
    var url = new URL(requestDetails.url);
    console.debug('Entering remove_searchparams -- got url: ' + url);
    if (url.search.length > 0) {
        url.search = "";
        // console.debug("Clean url to:", url.href);
        return {redirectUrl: url.href};
    }
    return {redirectUrl: ''};
}

browser.webRequest.onBeforeRequest.addListener(
    remove_searchparams,
    {urls: aliexpress_regexp,
     types: ["main_frame"]
    }, ["blocking"]
);

function build_redirect_to_query_param(query_param_name){
    // console.debug('Build redirect with params: ' + query_param_name);
    const redirect_to_get_param = function(requestDetails){
        const search_params = new URLSearchParams(new URL(requestDetails.url).search);
        const real_url_from_param = search_params.get(query_param_name);
        if (real_url_from_param){
            // console.debug('Redirecting to ' + real_url_from_param);
            return {redirectUrl: real_url_from_param};
        }
        return {redirectUrl: ''};
    };
    return redirect_to_get_param;
}

const urls_to_param_mappers = [
    {
        urls: ["*://l.facebook.com/*"],
        param_name: 'u'
    },
    {
        urls: ["*://out.reddit.com/*"]
    },
    {
        urls: ["*://steamcommunity.com/linkfilter/*"]
    }
];

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
