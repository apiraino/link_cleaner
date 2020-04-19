let prefs = {
    'clean_amp_links': false,
    'redirect_reddit_nojs': false
};

/*
  Store the currently selected settings using browser.storage.local.
*/
function storeSettings() {

    function getTypes() {
        let dataTypes = [];
        const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
        for (let item of checkboxes) {
            const _attr = item.getAttribute("data-type");
            if (item.checked) {
                // dataTypes.push(item.getAttribute("data-type"));
                dataTypes.push({ [_attr] : true });
            } else {
                dataTypes.push({ [_attr] : false });
            }
        }
        return dataTypes;
    }

    const dataTypes = getTypes();
    console.debug("Saving settings:  ", dataTypes);
    browser.storage.local.set({
        dataTypes
    }).then(setItem, onError);

    update_prefs(dataTypes);
}

function setItem(items) {
    console.debug("Item set OK");
    // console.debug(items);
}

function onError(error) {
    console.error("EEEKK storage error: " + error);
}

/*
  Update prefs Object (only in this context)
*/
function update_prefs(dataTypes) {
    // reset prefs
    for (item in prefs) {
        prefs[item] = false;
    }

    // updates prefs with new values
    dataTypes.forEach(function(v, k) {
        const _key = Object.keys(dataTypes[k])[0];
        const _val = dataTypes[k][_key];
        prefs[_key] = _val;
    });
    console.debug(prefs);
}

/*
  Send message to extension and update "live" prefs
*/
function notifyExtension(e) {
    browser.runtime.sendMessage(prefs);
}

/*
  update the options UI with the settings values retrieved from storage,
  or the default settings if the stored settings are empty.
*/
function updateUI(restoredSettings) {

    // Localize UI
    const settings_title = browser.i18n.getMessage('settingsTitle');
    const clean_amp_links_lbl = browser.i18n.getMessage('settingsSanitizeAMPLabel');
    const redirect_reddit_nojs_lbl = browser.i18n.getMessage('settingsRedirectRedditNoJSLabel');
    const save_prefs_lbl = browser.i18n.getMessage('settingsSavePrefs');
    document.querySelector("#clean-amp-links-lbl").innerText = clean_amp_links_lbl;
    document.querySelector("#redirect-reddit-nojs-lbl").innerText = redirect_reddit_nojs_lbl;
    document.querySelector("#settings-title").innerText = settings_title;
    document.querySelector("#save-button").value = save_prefs_lbl;

    // populate options
    const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");

    // put all defaults in a sane structure (ugh)
    let restoredSettingsKeys = {};
    for(let i = 0; i < restoredSettings.dataTypes.length; i++) {
        const obj = restoredSettings.dataTypes[i];
        for (let key of Object.keys(obj)) {
            restoredSettingsKeys[key] = obj[key];
        }
    }

    // parse the options and updates settings
    for (let item of checkboxes) {
        const need_key = item.getAttribute("data-type");
        if (need_key in restoredSettingsKeys) {
            item.checked = restoredSettingsKeys[need_key];
        } else {
            item.checked = false;
        }
    }
}

/*
  On opening the options page, fetch stored settings and update the UI with them.
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

/*
  On clicking the save button, save the currently selected settings
  and notify the background scripts (not directly accessible from this context)
*/
const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
saveButton.addEventListener("click", notifyExtension);
