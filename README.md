# ![Link Cleaner+](/assets/web-link-cleaned-thumb.png) Link Cleaner+

This project is a fork of [Link Cleaner](https://github.com/idlewan/link_cleaner), a Firefox extension to sanitize links removing all tracking parameters. This fork would like to keep the original project alive. We have a [roadmap](https://github.com/apiraino/link_cleaner/wiki) and a list of items (features and bugs) open up for grabs. Contributions are welcome!

## Why "Link Cleaner+"

The original project seems to have stalled, issues and pull requests don't get through. We will try picking up where the original project left and move forward. You can install Link Cleaner+ from the [Mozilla Add-ons website](https://addons.mozilla.org/en-US/firefox/addon/link-cleaner-plus/).

## How does it work?

Links are checked and sanitized before any further action is performed (browser redirect, open tab, copy link). Sanitization is performed based on a blacklist.

Feature list:
- [x] removes utm_* parameters
- [x] on item pages such as of Aliexpress and Amazon, removes tracking parameters
- [x] on item pages of Amazon, rewrites SEO friendly links to the tbare minimum (see examples below)
- [x] Configurable flag to enable / disable AMP links cleanlinks
- [x] Context menu item to copy sanitized link to clipboard
- [ ] (partly implemented) skip redirect pages of facebook, steam and reddit (directly go to the url
being redirected to, and never hit their outgoing redirect tracking)

You can now visit and bookmark clean links instead of the long, tracking-enabled ones!

Link Cleaner+ is a work in progress, [contributions and suggestions](https://github.com/apiraino/link_cleaner/issues) are welcome!

# Examples:

|                | utm_* removal                                                                                                                                                                                                    |
| -              | :-                                                                                                                                                                                                               |
| Original  | `http://meyerweb.com/eric/thoughts/2017/03/07/welcome-to-the-grid/?utm_source=frontendfocus&utm_medium=email`                                                                                                    |
| Sanitized | `http://meyerweb.com/eric/thoughts/2017/03/07/welcome-to-the-grid`                                                                                                                                               |
|                | **Amazon item URL**                                                                                                                                                                                              |
| Original  | `https://www.amazon.com/AmazonBasics-Type-C-USB-Male-Cable/dp/B01GGKYQ02/ref=sr_1_1?s=amazonbasics&srs=10112675011&ie=UTF8&qid=1489067885&sr=8-1&keywords=usb-c`                                                 |
| Sanitized | `https://www.amazon.com/dp/B01GGKYQ02`                                                                                                                                                                           |
|                | **Facebook redirect**                                                                                                                                                                                            |
| Original  | `https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.fsf.org%2Fcampaigns%2F&h=ATP1kf98S0FxqErjoW8VmdSllIp4veuH2_m1jl69sEEeLzUXbkNXrVnzRMp65r5vf21LJGTgJwR2b66m97zYJoXx951n-pr4ruS1osMvT2c9ITsplpPU37RlSqJsSgba&s=1` |
| Sanitized | `https://www.fsf.org/campaigns`                                                                                                                                                                                  |
|                | **Reddit redirect**                                                                                                                                                                                              |
| Original  | `https://out.reddit.com/t3_5pq7qd?url=https%3A%2F%2Finternethealthreport.org%2Fv01%2F&token=AQAAZV6JWHBBnIcVjV1wvxVg5gKyCQQSdUhGIvuEUmdPZhxhm8kH&app_name=reddit.com`                                            |
| Sanitized | `https://internethealthreport.org/v01/`                                                                                                                                                                          |
|                | **Steam redirect**                                                                                                                                                                                               |
| Original  | `https://steamcommunity.com/linkfilter/?url=https://getfedora.org/`                                                                                                                                              |
| Sanitized | `https://getfedora.org/`                                                                                                                                                                                         |


For a full list of test cases, have a look at the included [test_urls.html](https://github.com/apiraino/link_cleaner/blob/master/test_urls.html) file.

# Comparison to other add-ons

Unlike other legacy add-ons, Link Cleaner+ doesn't inject JavaScript into pages to change links. Instead, it listens to main url requests and changes them (if needed) to remove redirects or tracking.

That means it's doing less unneeded work and consumes less resources (memory and CPU).

# Notes

Cleaning Amazon URLs will break any affiliation program. Use the usual "copy link location" shortcut if you want to support the third-party affiliate program.

# Test the extension locally

You can use the `web-ext` package to keep things easier (see [documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/web-ext_command_reference#web-ext_sign) and [how to install](https://github.com/mozilla/web-ext)).

Install Use the provided script `web-ext-run.sh` to launch Firefox with a dedicated profile. The add-ons is already installed and the browser will open on the test HTML page.

Notice that since the profile is created at runtime, preferences saved by the extension will be lost once the browser will be closed (unless the parameter `--keep-profile-changes` is added to the `web-ext-run.sh` script.

The profile should be located in `/tmp`.

Enable extension debugging from `about:debugging` to see logging.

# Build extension for publishing
``` bash
# not signed, local installation (load from about:debugging#/runtime/this-firefox)
$ rm -f ~/tmp/link_cleaner_x.y.zip
$ zip -r -FS ~/tmp/link_cleaner_x.y.xpi manifest.json *.js _locales/ options/ assets/icon*
```

``` bash
# signed, suitable for publishing (needs API key set in env)
$ web-ext sign --ignore-files web-ext-run.sh
```

Note: the `sign` subcommand [has a bug](https://github.com/mozilla/web-ext/issues/793) when reading API keys from env.

# Credits

Original work: [Link Cleaner](https://github.com/idlewan/link_cleaner)

Icons made by [Daniel Bruce](https://www.flaticon.com/authors/daniel-bruce) and [Good Ware](https://www.flaticon.com/authors/good-ware) from [Flaticon](https://www.flaticon.com) licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0).

# License

Released under the GPLv3 license
