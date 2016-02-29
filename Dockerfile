FROM ntxcode/ubuntu-base:14.04
MAINTAINER Nathan Ribeiro, ntxdev <nathan@ntxdev.com.br>

# Install nginx
RUN \
  apt-get update -yq && DEBIAN_FRONTEND=noninteractive apt-get install -yq --no-install-recommends nginx build-essential && \
  curl --silent --location https://deb.nodesource.com/setup_0.10 | bash - && \
  apt-get install -y nodejs && \
  mkdir -p /var/www

# Build application
COPY . /tmp
WORKDIR /tmp
RUN npm install && npm install -g bower gulp && bower install --allow-root
ENV NODE_ENV production
RUN gulp

COPY ./app/dist /var/www/para-pesquisa-painel
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
RUN chown -R nobody. /var/www
RUN rm -rf /tmp/*

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx"]