"use strict";

/*
  copy text to clipboard
  ref: https://github.com/mdn/webextensions-examples/tree/master/context-menu-copy-link-with-types

*/

var global_link_text = '';

function maybe_clean (orig_url, regexp, f) {
    var res = '';
    for (var pat in regexp) {
        if (new RegExp(pat).test(orig_url)) {
            res = link_cleaner(orig_url, f)['redirectUrl'];
            break;
        }
    }
    return (res != '' ? res : orig_url);
}

function cleaner_entrypoint (orig_link) {

    // query params matching

    var new_link = maybe_clean(orig_link, all_urls, f_match_utm);
    console.debug("[copytoclipboard] link cleaned 1: " + new_link);

    new_link = maybe_clean(new_link, aliexpress_regexp, f_match_all);
    console.debug("[copytoclipboard] link cleaned 2: " + new_link);

    new_link = maybe_clean(new_link, all_urls, f_match_fbclid);
    console.debug("[copytoclipboard] link cleaned 3: " + new_link);

    new_link = maybe_clean(new_link, fbcontent_regexp, f_match_fbcontent);
    console.debug("[copytoclipboard] link cleaned 4: " + new_link);

    // TODO: add URL matching (amazon, google, ...)

    return new_link;
}

function copyToClipboard(text) {
    // does not work inside frame
    if ((document.activeElement instanceof HTMLIFrameElement) ||
        (document.activeElement instanceof HTMLFrameElement)) {
        // need to call it twice :/
        document.activeElement.blur();
        document.activeElement.blur();
    }

    // sequential execution of all cleaners
    console.debug("[copytoclipboard] link to be cleaned " + text);
    global_link_text = cleaner_entrypoint(text);

    // trigger cleaned link copy back in clipboard
    document.execCommand("copy");
}

/*
  Get cleaned link text and copy it back into the clipboard
  We need an event for this
*/

function oncopy(event) {
    console.debug("[oncopy] " + global_link_text);
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
