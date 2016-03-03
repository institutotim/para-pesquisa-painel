Para Pesquisa Painel Administrativo
===================================

Este repositório contém o código do painel administrativo do projeto Para Pesquisa. Para mais informações sobre a 
instalação da aplicação veja o guia presente no [repositório da API](https://github.com/institutotim/para-pesquisa-servidor).

## Instalação
Para utilizar o painel administrativo é necessário gerar uma build que aponte para a URL de instalação de sua API.

Para isso, as seguintes dependências são necessárias:

 * Node 0.10
 * NPM
 
### Baixe o repositório da aplicação
 
```
git clone git@github.com:institutotim/para-pesquisa-painel.git
```
 
### Instale as dependências
```
npm install -g bower gulp
npm install && bower install
```

### Crie a build apontando para seu servidor
```
API_URL=http://<URL da sua API> API_VERSION=2 ./node_modules/gulp/bin/gulp.js
```

Caso o procedimento seja realizado corretamente a pasta `app/dist` será criada. Basta colocar essa pasta em um servidor web
de sua escolha.