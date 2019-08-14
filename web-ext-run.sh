APIKEY="$WEB_EXT_API_KEY"
APISECRET="$WEB_EXT_API_SECRET"
unset WEB_EXT_API_KEY
unset WEB_EXT_API_SECRET

URL_PATH="/absolute/path/to/"

web-ext run --browser-console --target=firefox-desktop \
        --start-url=file://$URL_PATH/test_urls.html

export WEB_EXT_API_KEY=$APIKEY WEB_EXT_API_SECRET=$APISECRET
