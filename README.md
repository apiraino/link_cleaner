# Link Cleaner
Find and install this extension on the [Mozilla Add-ons website](
https://addons.mozilla.org/en-US/firefox/addon/link-cleaner/).

Browser extension to clean URLs that are about to be visited:
- removes utm_* parameters
- on item pages of aliexpress and amazon, removes tracking parameters
- skip redirect pages of facebook, steam and reddit (directly go to the url
being redirected to, and never hit their outgoing redirect tracking)

You can now visit and bookmark clean links instead of the long,
tracking-enabled ones!

# Examples:
- utm_* removal:
    http://meyerweb.com/eric/thoughts/2017/03/07/welcome-to-the-grid/?utm_source=frontendfocus&utm_medium=email
  is changed to:
    http://meyerweb.com/eric/thoughts/2017/03/07/welcome-to-the-grid/
- amazon item url:
    https://www.amazon.com/AmazonBasics-Type-C-USB-Male-Cable/dp/B01GGKYQ02/ref=sr_1_1?s=amazonbasics&srs=10112675011&ie=UTF8&qid=1489067885&sr=8-1&keywords=usb-c
  is changed to:
    https://www.amazon.com/AmazonBasics-Type-C-USB-Male-Cable/dp/B01GGKYQ02/
- facebook redirect:
    https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.fsf.org%2Fcampaigns%2F&h=ATP1kf98S0FxqErjoW8VmdSllIp4veuH2_m1jl69sEEeLzUXbkNXrVnzRMp65r5vf21LJGTgJwR2b66m97zYJoXx951n-pr4ruS1osMvT2c9ITsplpPU37RlSqJsSgba&s=1
  is changed to
    https://www.fsf.org/campaigns/
- reddit redirect:
    https://out.reddit.com/t3_5pq7qd?url=https%3A%2F%2Finternethealthreport.org%2Fv01%2F&token=AQAAZV6JWHBBnIcVjV1wvxVg5gKyCQQSdUhGIvuEUmdPZhxhm8kH&app_name=reddit.com
  is changed to:
    https://internethealthreport.org/v01/
- steam redirect
    https://steamcommunity.com/linkfilter/?url=https://getfedora.org/
  is changed to:
    https://getfedora.org/

For a full list of test cases, have a look at the included `test_urls.html` file.

# Comparison to other add-ons
Unlike other legacy add-ons like CleanLinks, Link Cleaner doesn't inject
JavaScript into pages to change links.  Instead, it listens to main url requests
and changes them (if needed to remove redirects or tracking.

That means it's doing less unneeded work and consumes less resources
(memory and CPU).

# Notes

Cleaning Amazon URLs will break any affiliation program. Just remember to use
the usual "copy link location" shortcut that if you want to support the
third-party affiliate program.

# Test the extension locally

You can use the `web-ext` package to keep things easier (see [documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/web-ext_command_reference#web-ext_sign) and [how to install](https://github.com/mozilla/web-ext)).

Install Use the provided script `web-ext-run.sh` to launch Firefox with a
dedicated profile. The add-ons is already installed and the
browser will open on the test HTML page.

Notice that since the profile is created at runtime, preferences saved by the extension will be lost once the browser will be closed (unless the parameter `--keep-profile-changes` is added to the `web-ext-run.sh` script.

The profile should be located in `/tmp`.

# Build extension for publishing
``` bash
# not signed, local installation
$ rm -f ~/tmp/link_cleaner_x.y.zip
$ zip -r -FS ~/tmp/link_cleaner_x.y.xpi manifest.json *.js _locales/ options/
```

``` bash
# signed, suitable for publishing (needs API key set in env)
$ web-ext sign --ignore-files web-ext-run.sh
```

Note: the `sign` subcommand [has a bug](https://github.com/mozilla/web-ext/issues/793) when reading API keys from env.


# Credits

German localization: [finke.media](https://www.finke.media)

# License
Released under the GPLv3 license
