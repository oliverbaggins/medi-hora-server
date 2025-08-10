# MediHora — API de Lembretes de Remédios

**MediHora** é uma **API REST** (Node.js + Express + MongoDB) para cadastro de usuários, autenticação via **JWT** (access/refresh tokens) e **CRUD de lembretes de medicamentos**.

> ✅ **É uma API** (não entrega páginas/HTML). As rotas expõem recursos JSON e usam tokens para autenticação.

---

## Stack Técnica
- **Runtime**: Node.js (Express)
- **Banco**: MongoDB (Mongoose)
- **Auth**: JWT (Access Token + Refresh Token em *token rotation* salvo no usuário)
- **Validação**: `express-validator`
- **Criptografia**: `bcrypt`
- **Dev/CI**: Jest + Supertest, Docker/Docker Compose

---

## Modelos de Dados (Mongoose)

### `User`
```js
{
  name: String,        // obrigatório
  lastname: String,    // obrigatório
  email: String,       // obrigatório (não validado como unique no schema)
  password: String,    // hash bcrypt
  reminders: [ObjectId], // ref 'Reminder' (relacionamento)
  refreshTokens: [      // refresh tokens ativos do usuário
    { token: String, createdAt: Date }
  ]
}
```

### `Reminder`
```js
{
  user_id: ObjectId, // ref 'User' (obrigatório)
  medicine: String,  // nome do remédio (obrigatório)
  startDate: Date,   // início do tratamento (obrigatório)
  endDate: Date,     // término do tratamento (obrigatório)
  time: Date,        // horário do lembrete (obrigatório)
  frequency: String, // enum: 'a cada 4 horas'|'a cada 6 horas'|'a cada 8 horas'|'a cada 12 horas'
}
```

> `time` é armazenado como `Date`. Recomenda-se enviar um **ISO-8601** com hora do dia, ex.: `2025-08-10T08:00:00.000Z`.

---

## Autenticação
- **Access Token**: curto prazo (expiração definida no código).
- **Refresh Token**: 2 dias (padrão no código), **armazenado no usuário** (`user.refreshTokens`). Existe uma rotina que **remove tokens expirados periodicamente**.
- **Header de Autorização**: o middleware lê **`Authorization`** e espera **o token puro** (sem prefixo `Bearer`).

```http
Authorization: <ACCESS_TOKEN_AQUI>
```

> Observação de código: o projeto contém *markers* de merge em `routes/auth.js` que divergem o `expiresIn` do access token (`'1d'` vs `'10s'`). Ajuste para o valor desejado antes de produção.

---

## Executando

### Com Docker (recomendado para local)
```bash
docker-compose up --build
# API em http://localhost:3000
# MongoDB em localhost:27017 (container: mongo_db)
```
O `docker-compose.yml` já injeta:
- `DATABASE_URL=mongodb://mongo_db/reminders`
- `ACCESS_TOKEN_SECRET=...`
- `REFRESH_TOKEN_SECRET=...`

### Sem Docker
1) Crie `.env` (ou exporte variáveis de ambiente):
```env
DATABASE_URL=mongodb://localhost:27017/reminders
ACCESS_TOKEN_SECRET=uma_chave_aleatoria_grande
REFRESH_TOKEN_SECRET=outra_chave_aleatoria_grande
```
2) Instale dependências e suba o servidor:
```bash
npm install
npm run start   # inicia com nodemon em :3000
```
A API sobe em `http://localhost:3000`.

---

## Endpoints

> Base URL: **`http://localhost:3000`**

### Auth
| Método | Rota                          | Autenticação | Descrição |
|-------:|-------------------------------|--------------|-----------|
| POST   | `/auth/signup`                | —            | Cria usuário, retorna **accessToken** e **refreshToken** |
| POST   | `/auth/login`                 | —            | Login com email/senha, retorna **accessToken** e **refreshToken** |
| GET    | `/auth/loggeduser`            | Access Token | Retorna dados do usuário logado |
| GET    | `/auth/allusers`              | —            | **(Atenção)** lista todos os usuários (útil para testes; restrinja em produção) |
| POST   | `/auth/token`                 | Refresh Token| Gera um novo **accessToken** (enviar refresh token no header `Authorization`) |
| DELETE | `/auth/logout`                | Refresh Token| Invalida (remove) o refresh token atual do usuário |
| DELETE | `/auth/deleteuser/:userId`    | Access Token | Exclui um usuário pelo id |

**Exemplos**

Cadastro:
```bash
curl -X POST http://localhost:3000/auth/signup  -H "Content-Type: application/json"  -d '{
   "name":"Ana",
   "lastname":"Silva",
   "email":"ana@example.com",
   "password":"minhasenha123"
 }'
```

Login:
```bash
curl -X POST http://localhost:3000/auth/login  -H "Content-Type: application/json"  -d '{"email":"ana@example.com","password":"minhasenha123"}'
```

Refresh (gera novo access token):
```bash
curl -X POST http://localhost:3000/auth/token  -H "Authorization: <REFRESH_TOKEN_AQUI>"
```

Logout (revoga refresh token atual):
```bash
curl -X DELETE http://localhost:3000/auth/logout  -H "Authorization: <REFRESH_TOKEN_AQUI>"
```

### Reminders
> Todas as rotas de **reminders** exigem **Access Token** no header `Authorization`.

| Método | Rota              | Descrição |
|-------:|-------------------|-----------|
| GET    | `/reminders`      | Lista **todos os lembretes do usuário logado** |
| GET    | `/reminders/:id`  | Obtém um lembrete específico **se pertencer ao usuário** |
| POST   | `/reminders`      | Cria um novo lembrete |
| PATCH  | `/reminders/:id`  | Atualiza campos do lembrete (parcial) |
| DELETE | `/reminders/:id`  | Remove o lembrete |

**Body (POST/PUT/PATCH)**:
```json
{
  "medicine": "Amoxicilina 500mg",
  "startDate": "2025-08-10T00:00:00.000Z",
  "endDate":   "2025-08-20T00:00:00.000Z",
  "time":      "2025-08-10T08:00:00.000Z",
  "frequency": "a cada 8 horas"
}
```

Criar lembrete:
```bash
curl -X POST http://localhost:3000/reminders  -H "Content-Type: application/json"  -H "Authorization: <ACCESS_TOKEN_AQUI>"  -d '{
   "medicine":"Amoxicilina 500mg",
   "startDate":"2025-08-10T00:00:00.000Z",
   "endDate":"2025-08-20T00:00:00.000Z",
   "time":"2025-08-10T08:00:00.000Z",
   "frequency":"a cada 8 horas"
 }'
```

Listar do usuário atual:
```bash
curl -H "Authorization: <ACCESS_TOKEN_AQUI>"  http://localhost:3000/reminders
```

---

## Validações Principais
- `POST /auth/signup`: `name`, `lastname` **não vazios**, `email` **válido**, `password` **mín. 6 caracteres**.
- `POST /auth/login`: senha é comparada com `bcrypt` (hash).

---

## Observações Importantes
- `checkAuth` busca o token em `Authorization` e faz `jwt.verify` com `ACCESS_TOKEN_SECRET`. **Ele atribui `req.user = user._id`**, enquanto algumas rotas acessam `req.user._id`. Se necessário, ajuste o middleware para `req.user = user` ou altere as consultas para usar `req.user` diretamente.
- **/auth/allusers** está **sem proteção** — recomendado restringir/retirar em produção.
- Existem *markers* de merge (`<<<<<<< HEAD ... >>>>>>>`) em `routes/auth.js`. Resolva-os antes de produção para padronizar expiração do access token e respostas de `signup`.

---

## Postman
O repositório inclui `tests/API.postman_collection.json` com chamadas de exemplo (signup, login, refresh, CRUD de reminders). Basta **importar** no Postman e usar `http://localhost:3000` como base.

---

## Boas Práticas Recomendadas
- Adotar prefixo `Bearer` no `Authorization` (e ajustar o middleware).
- Marcar `email` como **único** no schema (ou índice único em Mongo).
- Padronizar `expiresIn` do access token (ex.: `15m`/`1h`) e o *refresh* (ex.: `7d`/`15d`).
- Habilitar CORS conforme o cliente.
- Logs estruturados e variáveis sensíveis **somente via ambiente**.

---
