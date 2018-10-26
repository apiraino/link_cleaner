"use strict";

/*
  copy text to clipboard
  ref: https://github.com/def00111/copy-link-text
*/

function copyToClipboard(text) {
    console.debug("Called copyToClipboard");
    // does not work inside frame
    if ((document.activeElement instanceof HTMLIFrameElement) ||
        (document.activeElement instanceof HTMLFrameElement)) {
        // need to call it twice :/
        document.activeElement.blur();
        document.activeElement.blur();
    }
    strToCopy['redirectUrl'] = text;
    document.execCommand("copy");
}


function oncopy(event) {
    if (strToCopy['redirectUrl'] === "") {
        return;
    }
    console.debug("Called COPY: " + strToCopy['redirectUrl']);

    // Hide the event from the page to prevent tampering.
    event.stopImmediatePropagation();

    // Overwrite the clipboard content.
    event.preventDefault();

    event.clipboardData.setData("text/plain", strToCopy['redirectUrl']);
    strToCopy["redirectUrl"] = "";
}

document.addEventListener("copy", clean_utm_evt, true);
document.addEventListener("copy", oncopy, true);
