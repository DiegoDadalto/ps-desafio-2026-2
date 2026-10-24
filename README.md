# Sistema de Gestão de Projetos MEJ
## Iniciando projeto
Clone o projeto para sua máquina:
```bash
    git clone link-do-projeto
```
### Laravel
Dentro da pasta `backend` siga as seguintes instruções.
1. Instale as dependências:
    ```bash
    composer install
    ```
2. Crie o arquivo de variáveis globais do projeto **backend**:
    ```bash
    cp .env.example .env
    ```
3. Após isso insira as credenciais do banco de dados no arquivo `.env`
4. Crie o schema no banco de dados. O nome do banco deve ser o valor contido na variável `DB_DATABASE` presente no arquivo `.env`. 
5. Gere a chave do projeto:
    ```bash
    php artisan key:generate
    ```
6. Crie o link simbólico com o diretório storage:
    ```bash
    php artisan storage:link
    ```
7. Rode as migrations:
    ```bash
    php artisan migrate --seed
    ```
   1. Caso as migrations já tenham sido rodadas anteriormente no seu banco de dados, execute o comando:
        ```bash
        php artisan migrate:fresh --seed
        ```
8. Inicie o servidor **backend**:
    ```bash
    php artisan serve
    ```
    1. O servidor **backend** será iniciado por padrão no endereço `http://127.0.0.1:8000`. 
### React.js/Next.js
Tenha o gerenciador de pacotes <a href="https://pnpm.io/pt/installation">pnpm</a> instalado globalmente em sua máquina.

Dentro da pasta `frontend` siga as seguintes instruções.
1. Instale as dependências:
    ```bash
    pnpm install
    ```
2. Crie o arquivo de variáveis globais do projeto **frontend**:
    ```bash
    cp .env.local.example .env.local
    ```
3. Inicie o servidor **frontend**:
    ```bash
    pnpm dev
    ```
    1. O servidor **frontend** será iniciado por padrão no endereço `http://127.0.0.1:3000`. 


## ARQUITETURA E MODELAGEM DO PROJETO
### Modelagem do banco de dados

**imagem**
A modelagem do banco de dados foi feita a partir de um relato de usuário, adicionando à estrutura do banco previamente existente. A tabela **Tarefas** foi adicionada para armazenar atributos relacionados às tarefas individuais dos projetos do MEJ. Abaixo, estão os atributos presentes na tabela:

- **id:** Identificador padrão de tabelas no Laravel;
- **idMembro_alocado (Chave estrangeira):** Identificador do membro alocado à tarefa. Relaciona-se com a tabela **Membros**;
- **idProjeto_vinculado (Chave estrangeira):** Identificador do projeto vinculado à tarefa. Relaciona-se com a tabela **Projetos**;
- **titulo:** O título da tarefa;
- **descricao:** Um breve texto descritivo acerca da tarefa;
- **data_inicio** e **data_fim:** Datas que marcam o início e fim de uma tarefa.

As relações foram estabelecidas tomando o atributo **id**, presente em ambas as tabelas **Membros** e **Projetos**, como **Chave primária** da tabela, relacionando ambas as tabelas com a tabela **Tarefas** utilizando da relação **um-para-muitos (1:N)** em ambas as chaves primárias (1) às chaves estrangeiras (N).

### Regras de negócio

1. **Um membro não pode participar de mais de dois projetos ativos ao mesmo tempo:** Ao criar uma tarefa, o usuário será solicitado a inserir uma data de início e uma data de fim para a tarefa; o sistema então irá verificar se o intervalo especificado têm interseções com o intervalo de tempo de outra tarefa; caso hajam tarefas ativas em mais de dois projetos ao mesmo tempo (incluindo a tarefa prestes a ser inserida), o sistema bloqueará a criação da tarefa para evitar a sobrecarga de trabalho de um membro, exibindo uma mensagem de erro.
A validação da regra de negócio no backend foi feita da seguinte maneira:

**TarefaController - função store()**
```php
$idMembro = $request->input('idMembro_alocado');
$idProjeto = $request->input('idProjeto_vinculado');
$dataInicio = $request->input('data_inicio');
$dataFim = $request->input('data_fim');
$projetoInserido = Projeto::findOrFail($idProjeto);

$numeroProjetos = Tarefa::where('idMembro_alocado', $idMembro)
                        ->where('idProjeto_vinculado', '!=', $idProjeto)
                        ->where(function ($req) use ($dataInicio, $dataFim) {
                            $req->where('data_inicio', '<=', $dataFim)->where('data_fim', '>=', $dataInicio);
                        })->distinct('idProjeto_vinculado')
                        ->count('idProjeto_vinculado');

if ($numeroProjetos >= 2) {
    return response()->json(['message' => 'Um membro não pode participar de mais de dois projetos ativos.'], Response::HTTP_UNPROCESSABLE_ENTITY);
}
```

A variável `$numeroProjetos` guarda o número de projetos ativos distintos que o membro está através da consulta do Eloquent na tabela **Tarefas** que realiza a verificação do conflito de projetos. Funciona da seguinte maneira:
    - Seleciona todas as tarefas alocadas ao membro sendo inserido;
    - Seleciona todos os projetos vinculados ao membro diferentes do projeto da nova tarefa;
    - Agrupa as cláusulas numa função anônima, buscando projetos que têm uma data de início posterior à data de fim sendo inserida, e projetos que têm uma data de término anterior à data de início sendo inserida (ou seja, verifica se existe sobreposição de intervalos);
    - Desconsidera duplicatas de projeto;
    - Conta o número de projetos ativos com intervalos de tempo sobrepostos;
    - Verifica se o número de projetos é maior ou igual a dois, caso seja, dispara uma mensagem de erro e um código de status 422 (HTTP_UNPROCESSABLE_ENTITY).


2. **A data de início de uma tarefa não pode ser anterior à data de início do projeto vinculado:**

**TarefaController - função store()**
```php
if ($dataInicio < $projetoInserido->data_inicio) {
    return response()->json(['message' => 'Uma tarefa não pode começar antes do início de um projeto.'], Response::HTTP_UNPROCESSABLE_ENTITY);
}
```

O backend faz uma comparação simples, verificando se a data de início da tarefa sendo inserida é anterior à data de início do projeto vinculado à tarefa, caso seja, dispara uma mensagem de erro e um código de status 422 (HTTP_UNPROCESSABLE_ENTITY).

3. **A data de término de uma tarefa não pode ser posterior à data de término do projeto vinculado:**

**TarefaController - função store()**
```php
if ($dataFim > $projetoInserido->data_fim) {
    return response()->json(['message' => 'Uma tarefa não pode terminar após o fim de um projeto.'], Response::HTTP_UNPROCESSABLE_ENTITY);
}
```

O backend faz uma comparação similar à anterior, verificando se a data de fim da tarefa sendo inserida é posterior à data de fim do projeto vinculado à tarefa, caso seja, dispara uma mensagem de erro e um código de status 422 (HTTP_UNPROCESSABLE_ENTITY).


## DOCUMENTAÇÃO DA API