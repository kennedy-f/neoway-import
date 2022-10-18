#### Neoway Import 

#### How to run | Como rodar
```shell
  docker-compose up
```

para trocar o arquivo de upload, altere no .env 

Sempre que rodar docker-compose up estou derrubando os 
dados para testar mais facilmente. 


### Stack

- NodeJs
- Typescript 
- Nodemon 
- Typeorm 
- Postgresql


Utilizei um ORM para criação do banco, no teste não especificava se eu precisava 
utilizar o driver puro, porém fiz uma query apenas para garantir, como 
trato os dados antes de salvar o risco de um SQL INJECTION é baixo. 
 


O tempo de execução na minha maquina não passa de ``5 segundos para o import``

Fechando a sessao com o banco e até o fim da execucao do container temos a 
``média de 15s``  

![img.png](img.png)

#### Entendimento do problema 
Temos o usuario/cliente e ``o valor do ultimo ticket`` desse cliente,
``a loja da ultima compra`` e ``a data dessa compra``, com isso podemos criar
uma ``tabela`` que armazene os ``tickets``, 
 

Também temos uma coluna de ticket médio, creio que a média seja um valor computado
de todos os tickets que esse usuario já comprou, logo nesse import o dado é fixo 
por eu nao ter encotrado usuarios iguais no sistema, e ele seria feito de forma 
assincrona, sempre que um usuario adicionasse mais um ticket.


#### Banco


#### Duvidas   
Não ficou claro se era necessário fazer uma API, com upload e etc.

Como era pra ser feito a higienização dos dados,
se era pra ser feito apenas DEPOIS de persistir os dados no banco, 
eu acabei fazendo antes de persistir, até porque eu tenho uma
query em hardcode.



