#!/usr/bin/env watchr

# config file for watchr http://github.com/mynyml/watchr
# install: gem install watchr
# run: watch watchr.rb
# note: make sure that you have jstd server running (server.sh) and a browser captured

log_file = File.expand_path(File.dirname(__FILE__) + '/../logs/jstd.log')

`cd ..`
`touch #{log_file}`

puts "String watchr... log file: #{log_file}"

watch( '(app/js|test/unit)' )  do
  `echo "\n\ntest run started @ \`date\`" > #{log_file}`
  `scripts/test.sh &> #{log_file}`
end

curl 'http://para-pesquisa-api.cognita.ntxdev.com.br/1/session?ver=0.09786352654919028'
-X OPTIONS
-H 'Access-Control-Request-Method: POST'
-H 'Origin: http://para-pesquisa.cognita.ntxdev.com.br'
-H 'Referer: http://para-pesquisa.cognita.ntxdev.com.br/'
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
-H 'Access-Control-Request-Headers: accept, content-type' --compressed

curl -X OPTIONS
-H "Content-Type: application/json"
-H "Access-Control-Request-Method: POST"
-H "Origin: http://para-pesquisa.cognita.ntxdev.com.br"
-H "Referer: http://para-pesquisa.cognita.ntxdev.com.br/"
-H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"
-H "Access-Control-Request-Headers: accept, content-type"
-H "Cache-Control: no-cache"
-H "Postman-Token: 2d4f4662-e5c4-7ee3-4913-18947074cece"
http://para-pesquisa-api.cognita.ntxdev.com.br/1/session