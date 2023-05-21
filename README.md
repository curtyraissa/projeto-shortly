
<h1 align="center">Shortly - Node / SQL</h1>

✅ Requisitos
- Geral
    - [x]  A porta utilizada pelo seu servidor deve ser a **5000**.
    - [x]  Versionamento usando Git é obrigatório, crie um **repositório público** no seu perfil do GitHub **apenas com o código do back-end.**
    - [x]  Faça commits a cada funcionalidade implementada.
    - [x]  **Utilize dotenv.**
    - [x]  Não esqueça de criar o `.gitignore`: a `node_modules` e o `.env` não devem ser commitados.
    - [x]  Seu projeto deve ter, obrigatoriamente, os arquivos `package.json` e `package-lock.json`, que devem estar na raiz do projeto. Eles devem conter todas as **dependências** do projeto.
    - [x]  Adicione o código que inicia o servidor, com a função `listen`, no arquivo `src/app.js`.
    - [x]  Adicione um script no `package.json` para iniciar o servidor rodando `npm start` como no exemplo abaixo:
        
        ```json
        // package.json
        {
          //...
          "scripts": {
            //...
            "start": "node ./src/app.js"
          }
        }
        ```
        
    - [x]  A estrutura de arquivos e pastas do projeto deve seguir o padrão aprendido nas últimas semanas, com as camadas `controllers`, `routers`, `middlewares` e `schemas` (onde for necessário).
- Banco de dados
    - [x]  Dessa vez, todo o banco será criado por você do zero! Utilize o banco de dados PostgreSQL e modele o banco de dados de acordo com a necessidade.
    - [x]  Use **CONSTRAINTS** quando aplicável para garantir a lógica de negócio da aplicação.
    - [x]  Use um campo chamado `createdAt` para armazenar a data de criação das entidades.
    - [x]  **Todas chaves primárias devem ser números inteiros.**
    - [x]  **Abuse do SQL!** Faça o mínimo possível de processamento no navegador.
- *Back-end*
    - [x]  Implemente o *back-end* da aplicação em **Node + Express** seguindo a arquitetura de *routes*, *controllers* e *middlewares*.
    - [x]  Dados sensíveis (como senhas) devem estar **criptografados**.
    - [x]  Proteja sua aplicação contra ataques do tipo *SQL Injection*.
    - [x]  Defina no arquivo `package.json` os scripts de inicialização da API, informe que deseja trabalhar com modules na aplicação e confira se as dependências estão devidamente instaladas no projeto.
- Autenticação
    - [x]  Todas as rotas autenticadas devem receber um *header* `Authorization` no formato `Bearer TOKEN`.
    - [x]  Note que nem todas as rotas são autenticadas! Isso está descrito em cada rota da seção abaixo (Rotas).
- Rotas
    - **POST** `/signup`
        - Esta **não é** uma rota autenticada.
        - Deve receber um corpo (*body*) no formato:
            
            ```jsx
            {
            	name: "João",
              email: "joao@driven.com.br",
              password: "driven",
              confirmPassword: "driven"
            }
            ```
            
        - Deve responder com *status code* `201`.
        - Caso exista algum erro no formato do corpo enviado, responder com status code `422` e os erros correspondentes.
            - Considere erro no formato dos dados enviados quando:
                1. Valores vazios,
                2. Tipos diferentes de string,
                3. Nomes dos campos são `email`, `name`, `password`, `confirmPassword`
                4. Os campos `password` e `confirmPassword` devem ser iguais.
                5. Deve ser um `email` com formato válido
        - Caso exista algum usuário cadastrado com o e-mail enviado no corpo da requisição, responder com *status code* `409`.
    - **POST** `/signin`
        - Esta **não é** uma rota autenticada.
        - Deve receber um corpo (*body*) no formato:
            
            ```jsx
            {
              email: "joao@driven.com.br",
              password: "driven"
            }
            ```
            
        - Deve retornar o *status code* `200` com o *token* gerado para autenticação. O body deverá estar no formato:
            
            ```jsx
            { token: "MEUTOKEN" }
            ```
            
        - Caso o usuário/senha não seja compatível (ou não exista), retornar o status code `401`.
        - Caso exista algum erro no formato do corpo enviado, responder com status code `422` e os erros correspondentes.
            - Considere erro no formato dos dados enviados quando:
                1. Valores vazios,
                2. Tipos diferentes de string,
                3. Nomes dos campos são `email` e `password`
                4. Deve ser um `email` com formato válido
    - **POST** `/urls/shorten`
        - Esta é uma **rota autenticada.**
        - Deve receber um *header* `Authorization` no formato `Bearer TOKEN`.
        - Deve receber um corpo (*body*) no formato:
            
            ```json
            {
            	"url": "https://..."
            }
            ```
            
        - Deve responder com *status code* `201` e corpo (*body*) no formato:
            
            ```json
            {
              "id": 1,
            	"shortUrl": "a8745bcf" // aqui o identificador que for gerado
            }
            ```
            
        - Caso o *header* não seja enviado ou seja inválido, responder com *status code* `401`.
        - Caso exista algum erro no formato do corpo enviado, responder com *status code* `422` e os erros correspondentes.
        - 🔥 **Dica**: Use a biblioteca **[nanoid](https://www.npmjs.com/package/nanoid)** para gerar as `shortUrl`.
    - **GET** `/urls/:id`
        - Esta **não é** uma rota autenticada.
        - Deve responder com *status code* `200` e corpo (*body*) no formato:
            
            ```json
            {
            	"id": 1,
            	"shortUrl": "bd8235a0",
            	"url": "https://..."
            }
            ```
            
        - Caso a url encurtada não exista, responder com *status code* `404`.
    - **GET** `/urls/open/:shortUrl`
        - Esta **não é** uma rota autenticada.
        - Redirecionar o usuário para o link correspondente.
        - Aumentar um na contagem de visitas do link.
        - Caso a url encurtada não exista, responder com *status code* `404`.
        - 🔥 **Dica**: Procure por `res.redirect`.
    - **DELETE** `/urls/:id`
        - Esta é uma **rota autenticada.**
        - Deve receber um *header* `Authorization` no formato `Bearer TOKEN`.
        - Caso o *header* não seja enviado ou seja inválido, responder com *status code* `401`.
        - Deve responder com *status code* `401` quando a url encurtada não pertencer ao usuário.
        - Se a url for do usuário, deve responder com *status code* `204` e excluir a url encurtada.
        - Caso a url encurtada não exista, responder com *status code* `404`.
    - **GET** `/users/me`
        - Esta é uma **rota autenticada.**
        - Deve receber um *header* `Authorization` no formato `Bearer TOKEN`.
        - A rota deve retornar os dados do usuário atrelado ao token.
        - Deve responder com *status code* `200` e corpo (*body*) no formato:
            
            ```json
            {
              "id": id do usuário,
            	"name": nome do usuário,
            	"visitCount": soma da quantidade de visitas de todos os links do usuário,
            	"shortenedUrls": [
            		{
            			"id": 1,
            			"shortUrl": "...",
            			"url": "...",
            			"visitCount": soma da quantidade de visitas do link
            		},
            		{
            			"id": 2,
            			"shortUrl": "...",
            			"url": "...",
            			"visitCount": soma da quantidade de visitas do link
            		}
            	]
            }
            ```
            
        - Caso o *header* não seja enviado ou seja inválido, responder com *status code* `401`
    - **GET** `/ranking`
        - Esta **não é** uma rota autenticada.
        - Deve responder com *status code* `200` e corpo (*body*) no formato:
            
            ```json
            [
            	{
            		"id": id do usuário,
            		"name": nome do usuário,
            		"linksCount": 5,
            		"visitCount": 100000
            	},
            	{
            		"id": id do usuário,
            		"name": nome do usuário,
            		"linksCount": 3,
            		"visitCount": 85453
            	},
            	{
            		"id": id do usuário,
            		"name": nome do usuário,
            		"linksCount": 10,
            		"visitCount": 0
            	},
            	{
            		"id": id do usuário,
            		"name": nome do usuário,
            		"linksCount": 0,
            		"visitCount": 0
            	}
            ]
            ```
            
        - Limitado a **10 usuários.**
        - Esta lista deve ser **ordenada** pela soma de visitas de seus links.
        - Devem aparecer usuários cujos *links* não tiveram nenhuma visita, caso necessário.
        
        <aside>
        🔍 Pesquise por **LEFT JOIN** para implementar essa rota.
        
        </aside>
        
- Dump do banco de dados
    
    <aside>
    🔍 Pesquise por **PostgreSQL Dump** para esse requisito.
    Uma vez que você tenha entendido o conceito, para ajudar a guiar a pesquisa e execução, temos alguns guias de como fazer o Dump em diferentes ambientes:
    
    - PgAdmin
        - Criar o dump
            - Abra o pgAdmin
            - Botão direito no banco ⇒ backup
            - Cria um nome com a extensão `.sql`
            - **Atenção**: O dump ficará salvo no Linux em `/var/lib/pgadmin/storage/$user_pgadmin`
            - Para acessa-la, execute esse comando no terminal:
                
                ```bash
                sudo su
                ```
                
            - Agora navegue até a pasta:
                
                ```bash
                cd /var/lib/pgadmin/storage/docencia.thiago_gmail.com/
                ```
                
            - **Atenção**, troque o  `@` do seu user para `_`
            - De um ls na pasta e você vai encontrar os arquivos
            - Você não precisa ver esses arquivos, pois vai usar o dump direto no pgAdmin
        - Restaurar o dump
            - Criar um novo banco
            - Com o botão direito no novo banco ⇒ Restore
            - Escolher o arquivo de dump
    - CLI
        - Criar o dump
            - No terminal execute: `sudo -i -u postgres`
            - Digite: `pg_dump nome_banco > dump.sql`
        - Restaurar o dump
            - No terminal execute: `sudo -i -u postgres`
            - Entre no psql
            - Crie um novo banco de dados: `CREATE DATABASE nome_do_banco`
            - Saia no psql com ctrl+d
            - Execute o comando: `psql nome_banco < dump.sql`
            - Entre no banco e faça um `SELECT` para verificar se deu tudo certo.
    - No projeto
        - Linux CLI
            - Na pasta raiz do seu back-end, onde o arquivo `package.json` está, execute o seguinte comando:
                
                ```bash
                sudo su -c "pg_dump NOME_DO_BANCO --inserts --no-owner" postgres > dump.sql
                ```
                
            - Suba tudo para o GitHub e entregue o link no Hub.
        - MacOs CLI
            - Acesse o postgres pelo terminal com: `psql postgres`
            - Execute o comando:
            
            ```sql
            pg_dump nome_do_banco --inserts --no-owner -f dump.sql
            ```
            
    - Dump de um banco de dados no Render
        - Ao criar seu banco de dados no Render escolha a mesma versão do Postgres instalado em sua máquina
        - Para saber a versão do banco na sua máquina, abra o terminal e digite o comando:
        
        ```sql
        psql --version
        ```
        
        - No meu caso, a versão é a 12.13:
        
        ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9891e226-ff78-4a62-bafa-f9facd502a1c/Untitled.png)
        
        - Na criação do banco no render, eu escolho a versão 12:
        
        ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/12ce5d64-c3f8-4f11-a22a-9f6b1234b554/Untitled.png)
        
        - Agora entre na pasta que você quer salvar seu dump e digite o seguinte comando, alterando para as informações do seu banco no Render:
        
        ```sql
        PGPASSWORD=RENDERPASSWORD pg_dump -h RENDERHOSTNAME.oregon-postgres.render.com -U RENDERUSERNAME RENDERDATABASENAME \
        -n public --inserts --no-owner > database_dump.sql
        ```
        
        **ATENÇÃO:** Copie o código exatamente como está acima(sim, tem quebra de linha), com as alterações de informações do seu banco no Render.
        
        - Para encontrar as informações acima, basta entrar no banco de dado no Render e acessar o tópico Connections
        - RENDERPASSWORD
            
            ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0e45744f-93fa-4d36-9aba-d68eef58a63a/Untitled.png)
            
        - RENDERHOSTNAME
            
            ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8b047baa-6fef-4bcb-9f96-a1ad8bfacfa5/Untitled.png)
            
        - RENDERUSERNAME
            
            ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1462cc83-7d31-462f-8dc9-cbf93f750314/Untitled.png)
            
        - RENDERDATABASENAME
            
            ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b8dfeea7-a9dc-4a49-80ef-a5c4aa1a78c2/Untitled.png)
            
    </aside>
    
    - [x]  É **obrigatório** fazer o **dump do banco de dados e colocá-lo dentro da pasta raiz do projeto**. O arquivo gerado deve ter o nome `dump.sql`.
- *Deploy*
    - [x]  Faça o deploy da sua aplicação (tanto a API quanto o banco).
    - [x]  Na hora de fazer o deploy do banco, cuidado com conexão SSL! Se for configurar conexão SSL para deploy, o avaliador não conseguirá se conectar. Se for rodar o avaliador, desative a conexão SSL ou ative-a somente para deploy via variáveis de ambiente.
        
        ```jsx
        import pg from "pg"
        import dotenv from "dotenv"
        dotenv.config()
        
        const { Pool } = pg
        
        const configDatabase = {
          connectionString: process.env.DATABASE_URL,
        };
        
        if (process.env.MODE === "prod") configDatabase.ssl = true;
        
        export const db = new Pool(configDatabase);
        ```
        
        Então adicione no deploy (e somente no deploy) a variável de ambiente a seguir:
        
        ```jsx
        MODE = "prod"
        ```



## 🛠 &nbsp;Skills
<div align="center">
 <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" width="52" alt="node logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" width="52" alt="js logo"  />      
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" height="40" width="52" alt="express logo"  />
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/npm/npm-original-wordmark.svg" height="40" width="52" alt="npm logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="40" width="52" alt="git logo"  />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" height="40" width="52" alt="github logo" />                                   
</div>
<hr/>

## 🚀 &nbsp;Links

- [Deploy]().<br/>

```zsh
# iniciar servidor
npm run dev

# rodar banco
brew services start postgresql 
psql postgres 
brew services restart postgresql@14
   
# matar a porta comando no MAC
kill -9 PID

# listar as postar que estao sendo usada
lsof -i :5000
```

<hr/>

## 💬 &nbsp;Contact
<img align="left" src="https://avatars.githubusercontent.com/curtyraissa?size=100">

Feito por [Raissa Curty](https://github.com/curtyraissa)!

<a href="https://www.linkedin.com/in/raissa-curty/" target="_blank">
    <img style="border-radius:50%;" src="https://raw.githubusercontent.com/maurodesouza/profile-readme-generator/master/src/assets/icons/social/linkedin/default.svg" width="52" height="40" alt="linkedin logo"  />
</a>&nbsp;