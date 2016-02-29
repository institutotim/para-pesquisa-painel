#!/usr/bin/env bash
set -e
set -o pipefail

blow_up() {
	echo "Missing required enviroment variable '$1'. Please, take a look at the manual." >&2
	exit 1
}

[ "$API_URL" ] || blow_up 'API_URL'
[ "$API_URL" ] || blow_up 'API_VERSION'

sed -i.bak s@REPLACE_API_ENDPOINT@$API_URL@g /var/www/para-pesquisa-painel/js/upp-social-bundle.js
sed -i.bak s@REPLACE_API_VERSION@$API_VERSION@g /var/www/para-pesquisa-painel/js/upp-social-bundle.js

exec "$@"