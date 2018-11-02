APIKEY="$WEB_EXT_API_KEY"
APISECRET="$WEB_EXT_API_SECRET"
unset WEB_EXT_API_KEY
unset WEB_EXT_API_SECRET

web-ext run --browser-console --target=firefox-desktop \
        --start-url=file:///path/to/test_urls.html

export WEB_EXT_API_KEY=$APIKEY WEB_EXT_API_SECRET=$APISECRET
