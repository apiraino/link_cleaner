"use strict";

/*
  copy text to clipboard
  ref: https://github.com/mdn/webextensions-examples/tree/master/context-menu-copy-link-with-types

*/

var global_link_text = '';

function copyToClipboard(text) {
    console.debug("Called copyToClipboard");
    // does not work inside frame
    if ((document.activeElement instanceof HTMLIFrameElement) ||
        (document.activeElement instanceof HTMLFrameElement)) {
        // need to call it twice :/
        document.activeElement.blur();
        document.activeElement.blur();
    }

    // clean link text
    // TODO: we need a global entrypoint to all cleaners
    console.debug("[copytoclipboard] link to be cleaned " + text);
    global_link_text = clean_utm(text)['redirectUrl'];
    console.debug("[copytoclipboard] link cleaned " + global_link_text);
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
