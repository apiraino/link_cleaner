"use strict";

/*
  create a menu item.
  clean link before copying to clipboard
  ref: https://github.com/mdn/webextensions-examples/tree/master/menu-demo
*/

/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("menu item created successfully");
    }
}

/*
  Create all the context menu items.
*/
browser.menus.create({
    id: "copy-link",
    title: browser.i18n.getMessage("menuItemCopyAndClean"),
    contexts: ["selection", "link"]
}, onCreated);

/*
  The click event listener, where we perform the appropriate action given the
  ID of the menu item that was clicked.
*/
browser.menus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
    case "copy-link":
        copyToClipboard(info);
        break;
    }
});
