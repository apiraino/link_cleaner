var prefs = {
    'clean_amp_links': false
};

/*
  Store the currently selected settings using browser.storage.local.
*/
function storeSettings() {

    function getTypes() {
        let dataTypes = [];
        const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
        for (let item of checkboxes) {
            if (item.checked) {
                dataTypes.push(item.getAttribute("data-type"));
            }
        }
        return dataTypes;
    }

    const dataTypes = getTypes();
    console.debug("Saving settings:  " + dataTypes);
    browser.storage.local.set({
        dataTypes
    });

    update_prefs(dataTypes);
}

function update_prefs(dataTypes) {
    // reset prefs
    for (item in prefs) {
        prefs[item] = false;
    }

    // updates prefs with new values
    dataTypes.forEach(function(v, k) {
        console.debug("k=" + k + ", v=" + dataTypes[k]);
        prefs[v] = true;
    });
}

function notifyExtension(e) {
    browser.runtime.sendMessage(prefs);
}

/*
  update the options UI with the settings values retrieved from storage,
  or the default settings if the stored settings are empty.
*/
function updateUI(restoredSettings) {

    // Localize UI
    var settings_title = browser.i18n.getMessage('settingsTitle');
    var clean_amp_links_lbl = browser.i18n.getMessage('settingsSanitizeAMPLabel');
    var save_prefs_lbl = browser.i18n.getMessage('settingsSavePrefs');
    document.querySelector("#clean-amp-links-lbl").innerText = clean_amp_links_lbl;
    document.querySelector("#settings-title").innerText = settings_title;
    document.querySelector("#save-button").value = save_prefs_lbl;

    // populate options
    const checkboxes = document.querySelectorAll(".data-types [type=checkbox]");
    for (let item of checkboxes) {
        if (restoredSettings.dataTypes.indexOf(item.getAttribute("data-type")) != -1) {
            item.checked = true;
        } else {
            item.checked = false;
        }
    }
}

function onError(e) {
    console.error(e);
}

/*
  On opening the options page, fetch stored settings and update the UI with them.
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);

/*
  On clicking the save button, save the currently selected settings
  and notify the background scripts (not accessible from this context)
*/
const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
saveButton.addEventListener("click", notifyExtension);
