# Especificação da API – EncontreUmAmigo

## 1. Introdução

Esta documentação detalha os endpoints da API RESTful para o projeto "EncontreUmAmigo". A API é a interface de comunicação entre o cliente (frontend web/mobile) e o servidor (backend), permitindo a manipulação de todos os recursos do sistema.

* **URL Base:** `https://api.encontreumamigo.com/v1` (Exemplo)
* **Formato de Dados:** Todas as requisições e respostas utilizarão o formato `JSON`.

## 2. Autenticação e Autorização

Para garantir a segurança dos dados, endpoints que manipulam informações sensíveis (como criar animais ou gerenciar adoções) são protegidos e exigem autenticação.

* **Método:** A autenticação será baseada em **JSON Web Token (JWT)**.
* **Fluxo:**
    1.  O usuário (gestor) envia suas credenciais (`email` e `senha`) para o endpoint de login.
    2.  O servidor valida as credenciais e retorna um token JWT.
    3.  Para todas as requisições subsequentes a rotas protegidas, o cliente deve enviar este token no cabeçalho `Authorization`.
* **Exemplo de Cabeçalho:** `Authorization: Bearer <seu_token_jwt_aqui>`

## 3. Endpoints da API

### Recurso: Autenticação

#### **`POST /auth/login`**
* **Descrição:** Autentica um gestor e retorna um token de acesso.
* **Corpo da Requisição:**
    ```json
    {
      "email": "gestor@abrigo.com",
      "senha": "senhaSegura123"
    }
    ```
* **Resposta de Sucesso (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "usuario": {
        "id": "1",
        "nome": "Gestor Principal"
      }
    }
    ```

---
### Recurso: Animais

#### **`GET /animais`**
* **Descrição:** Retorna uma lista de todos os animais disponíveis para adoção. Pode incluir filtros como query parameters (ex: `/animais?especie=gato&porte=pequeno`).
* **Resposta de Sucesso (200 OK):**
    ```json
    [
      { "animalID": "1", "nome": "Mila", "especie": "Gato", "porte": "Pequeno" },
      { "animalID": "2", "nome": "Rex", "especie": "Cão", "porte": "Grande" }
    ]
    ```

#### **`GET /animais/{id}`**
* **Descrição:** Retorna os dados detalhados de um único animal, identificado pelo seu ID.
* **Parâmetros da URL:**
    * `id` (string): O ID único do animal.
* **Resposta de Sucesso (200 OK):**
    ```json
    {
      "animalID": "1",
      "nome": "Mila",
      "especie": "Gato",
      "idade": 2,
      "descricao": "Uma gatinha muito calma e carinhosa.",
      "fotos": ["url1.jpg", "url2.jpg"]
    }
    ```

#### **`POST /animais`**
* **Descrição:** Cadastra um novo animal no sistema. (Rota protegida, requer autenticação).
* **Corpo da Requisição:**
    ```json
    {
      "nome": "Bolinha",
      "especie": "Cão",
      "idade": 1,
      "porte": "Pequeno",
      "descricao": "Muito brincalhão e sociável."
    }
    ```
* **Resposta de Sucesso (201 Created):**
    ```json
    {
      "animalID": "3",
      "nome": "Bolinha",
      "status": "Disponível"
    }
    ```

---
### Recurso: Adoções

#### **`POST /adocoes`**
* **Descrição:** Submete uma nova candidatura de adoção.
* **Corpo da Requisição:**
    ```json
    {
      "animalID": "1",
      "adotanteID": "user123",
      "motivoCandidatura": "Tenho um lar seguro e sempre quis ter um gatinho."
    }
    ```
* **Resposta de Sucesso (201 Created):**
    ```json
    {
      "adocaoID": "xyz987",
      "statusDaAprovacao": "Em Análise"
    }
    ```

#### **`GET /adocoes`**
* **Descrição:** Retorna uma lista de todas as candidaturas de adoção. (Rota protegida, requer autenticação).
* **Resposta de Sucesso (200 OK):**
    ```json
    [
      {
        "adocaoID": "xyz987",
        "animalNome": "Mila",
        "adotanteNome": "Carlos Silva",
        "statusDaAprovacao": "Em Análise"
      }
    ]
    ```

#### **`PUT /adocoes/{id}`**
* **Descrição:** Atualiza o status de uma candidatura de adoção (ex: para "Aprovada" ou "Recusada"). (Rota protegida, requer autenticação).
* **Parâmetros da URL:**
    * `id` (string): O ID único da adoção.
* **Corpo da Requisição:**
    ```json
    {
      "statusDaAprovacao": "Aprovada",
      "observacoesGestor": "Candidato demonstrou ter ótimas condições."
    }
    ```
* **Resposta de Sucesso (200 OK):**
    ```json
    {
      "adocaoID": "xyz987",
      "statusDaAprovacao": "Aprovada"
    }
    ```
