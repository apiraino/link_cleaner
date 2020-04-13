"use strict";

/*
  get/set stored settings
  ref: https://github.com/mdn/webextensions-examples/tree/master/forget-it
*/


/*
  Default settings. If there is nothing in storage, use these values.
*/
const defaultSettings = {
    dataTypes: [
        {"clean_amp_links": false},
        {"redirect_reddit_nojs": false}
    ]
};

/*
  Settings actionable by the options datatypes
  These values are used by the extension
*/
var settings = {
    'clean_amp_links': false,
    'redirect_reddit_nojs': false,
};

/*
  Listener for settings update.
  Sender is in options.js
*/
browser.runtime.onMessage.addListener(notify);
function notify(message) {
    update_settings(message);
}


function onError(e) {
    console.error(e);
}

/*
  On startup, check whether we have stored settings.
  If we don't, then store the default settings.
*/
function checkStoredSettings(storedSettings) {
    console.debug("[checkstoredsettings] storedsettings: ");
    // console.debug(storedSettings);
    if (!storedSettings.dataTypes) {
        console.debug("[checkStoredSettings] Could NOT read settings, will set defaults");
        browser.storage.local.set(defaultSettings).then(function(res){
            console.debug("[checkStoredSettings] defaults set");
        }, onError);
    } else {
        console.debug("[checkStoredSettings] Settings successfully loaded");
        update_settings(storedSettings.dataTypes);
    }
    // console.debug("[checkStoredSettings] new_settings: ");
    // console.debug(settings);
    // check_storage();
}

function check_storage() {
    browser.storage.local.get().then(function(res){
        console.debug("[check_storage] got storage");
        console.debug(res);
    }, onError);
}


// also invoked by the notification message
function update_settings(new_settings) {
    // console.debug("[update_settings] updating with: ", new_settings);
    settings = new_settings;
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);
