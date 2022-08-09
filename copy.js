"use strict";

/*
  copy text to clipboard
  ref: https://github.com/mdn/webextensions-examples/tree/master/context-menu-copy-link-with-types

*/

let global_link_text = '';

function glob_to_regexp (pattern) {
    // https://stackoverflow.com/a/24558913
    return new RegExp(pattern
                      .replace(/([.?+^$[\]\\(){}|\/-])/g, "\\$1")
                      .replace(/\*/g, '.*'));
}

// remove tracking query params
function maybe_clean (orig_url, urls, f) {
    let res = '';
    for (let idx = 0; idx < urls.length; idx++) {
        const patt = glob_to_regexp(urls[idx]);
        if (patt.test(orig_url)) {
            res = link_cleaner(orig_url, f)['redirectUrl'];
            break;
        }
    }
    return (res != '' ? res : orig_url);
}

// rewrite URL
function maybe_clean_url (orig_url, urls, f) {
    let res = '';
    for (let idx = 0; idx < urls.length; idx++) {
        const patt = glob_to_regexp(urls[idx]);
        if (patt.test(orig_url)) {
            res = f(orig_url)['redirectUrl'];
            break;
        }
    }
    return (res != '' ? res : orig_url);
}

// pick one query param with a URL and redirect there
function _redirect_to_query_param (orig_url) {
    let res = '';
    for (let i = 0; i < urls_to_param_mappers.length; i++) {
        const item = urls_to_param_mappers[i];
        const query_param = item.query_param ? item.query_param : 'url';
        for (let idx = 0; idx < item.urls.length; idx++) {
            const patt = glob_to_regexp(item.urls[idx]);
            if (patt.test(orig_url)) {
                res = redirect_to_query_param(query_param, orig_url)['redirectUrl'];
                if (res != '') {
                    break;
                }
            }
        }
    }
    return (res != '' ? res : orig_url);
}

// this is only invoked on right-click menu action
function cleaner_entrypoint (orig_link) {

    // first check: find a query param with the real URL and redirect there
    let new_link = _redirect_to_query_param(orig_link);

    // 2nd check: remove tracking query params
    // TODO: profile && improve perfs here
    new_link = maybe_clean(new_link, all_urls, f_match_utm);
    new_link = maybe_clean(new_link, all_urls, f_match_fbclid);
    new_link = maybe_clean(new_link, aliexpress_regexp, f_match_all);
    new_link = maybe_clean(new_link, fbcontent_regexp, f_match_fbcontent);
    new_link = maybe_clean(new_link, instagram_regexp, f_match_igshid);
    new_link = maybe_clean(new_link, twitter_regexp, t_match_s_or_t);

    // 3rd check: (optional) clean Amazon URL
    if (settings['clean_amp_links'] === true) {
        new_link = maybe_clean_url(new_link, ["amazon"], clean_amazon);
    }

    // 4th check: (optional) redirect reddit URL
    if (settings['redirect_reddit_nojs'] === true) {
        new_link = new_link.replace('www', 'old');
    }

    // console.debug("[copytoclipboard] link cleaned: " + new_link);
    return new_link;
}

function copyToClipboard(obj) {
    // does not work inside frame
    if ((document.activeElement instanceof HTMLIFrameElement) ||
        (document.activeElement instanceof HTMLFrameElement)) {
        // need to call it twice :/
        document.activeElement.blur();
        document.activeElement.blur();
    }

    // if there is a link, clean it, otherwise copy the text
    if (obj.linkUrl !== undefined) {
        // sequential execution of all cleaners
        global_link_text = cleaner_entrypoint(obj.linkUrl);
    } else {
        global_link_text = obj.selectionText;
    }

    // trigger cleaned link copy back in clipboard
    document.execCommand("copy");
}

/*
  Get cleaned link text and copy it back into the clipboard
  We need an event for this
*/

function oncopy(event) {
    // console.debug("[oncopy] " + global_link_text);
    if (global_link_text === "") {
        return;
    }

    // Hide the event from the page to prevent tampering.
    event.stopImmediatePropagation();
    event.preventDefault();

    event.clipboardData.setData("text/plain", global_link_text);
    global_link_text = '';
}

document.addEventListener("copy", oncopy, true);
