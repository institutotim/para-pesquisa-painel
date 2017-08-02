## Para Pesquisa Painel Administrativo

    Para Pesquisa Painel Administrativo 
    Copyright (C) <2014> <Instituto TIM>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
--- 


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
