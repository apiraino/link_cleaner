"use strict";

/*
  get/set stored settings
  ref: https://github.com/mdn/webextensions-examples/tree/master/forget-it
*/


/*
  Default settings. If there is nothing in storage, use these values.
*/
var defaultSettings = {
    dataTypes: ["clean_amp_links"]
};

// Settings actionable by the options datatypes
var settings = {
    'clean_amp_links': false
};

function onError(e) {
    console.error(e);
}

/*
  On startup, check whether we have stored settings.
  If we don't, then store the default settings.
*/
function checkStoredSettings(storedSettings) {
    if (!storedSettings.dataTypes) {
        browser.storage.local.set(defaultSettings);
    }
    console.debug("dataTypes: " + storedSettings.dataTypes);
    update_settings(new_settings);
}

// also invoked by the notification message
function update_settings(new_settings) {
    settings = new_settings;
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);
