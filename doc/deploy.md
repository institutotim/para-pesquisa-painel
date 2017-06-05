# Overview da instalação

1 - A aplicação é feita em Docker. 

2 - Depois de realizado a instalação do Docker e das imagens, todos os dados da aplicação estão localizados em /opt/para-pesquisa. De nota os logs e a pasta onde é persistido o postgres ficam nela.

/opt
└── para-pesquisa
    ├── config
    ├── logs
    └── postgres-data

O firewall está habilitado e permitindo conexão as portas 22 e 80. Você pode ver o estado dele através do comando ufw status. 

A aplicação está roda e é monitorada pelo supervisord. O arquivo de configuração com os comandos para subir a aplicação está localizado em /etc/supervisord.conf. O estado pode ser visto com supervisorctl status. 

Todas as ferramentas do docker também estão a disposição para acesso aos containers e gestão das aplicações. Você pode ver os containers com docker ps e pode entrar neles através de docker exec -it para-pesquisa-api bash ou docker exec -it para-pesquisa-painel bash.

Se você for fazer o backup de forma física, basta parar o serviço do postgres (supervisorctl stop postgres) e fazer a cópia da pasta /opt/para-pesquisa/postgres-data ou caso deseje fazer um backup lógico: 

docker exec -it postgres /bin/bash -l -c "PGPASSWORD=123456 pg_dump --host localhost -U para-pesquisa para-pesquisa" > dump.sql

Se um dia quiser trocar a senha do DB por alguma razão é necessário alterar o arquivo postgres.env na pasta config da aplicação, e também alterar o DATABASE_URL no arquivo api.env. Depois disso basta rodar um supervisorctl restart postgres para-pesquisa-api. Imagino que isso não seja necessário visto que ele não está exposto a internet.
