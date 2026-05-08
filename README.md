# CRUD Loja Informatica

Projeto academico de integracao Front-End + Back-End para uma loja de informatica.

A aplicacao possui uma API em Node.js, TypeScript, Express e MySQL, alem de um front-end estatico em HTML, CSS e JavaScript puro. A tela principal faz CRUD completo de produtos consumindo a API com `fetch()` e atualizando o DOM sem recarregar a pagina.

## Tecnologias

- HTML5, CSS3 e JavaScript puro
- `fetch()` para consumo da API
- Node.js
- TypeScript
- Express
- MySQL com `mysql2`
- CORS
- Multer para upload opcional de imagem de produto

## Estrutura

```text
.
|-- docs/
|   |-- database.sql
|-- frontend/
|   |-- index.html
|   |-- style.css
|   |-- script.js
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- database/
|   |-- middleware/
|   |-- models/
|   |-- repository/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   |-- server.ts
|-- .env.example
|-- package.json
|-- README.md
```

## Instalacao

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` na raiz do projeto. Use `.env.example` como base:

```env
SERVER_PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=lojinha_informatica
```

## Banco de dados

Execute o script `docs/database.sql` no MySQL:

```sql
SOURCE docs/database.sql;
```

O script cria o banco `lojinha_informatica`, recria as tabelas e insere dados iniciais:

- 5 categorias
- 6 produtos
- 2 clientes
- 2 vendedores

Observacao: o script usa `DROP TABLE IF EXISTS`, entao ele limpa as tabelas atuais desse banco antes de recria-las.

## Executando a API

Modo desenvolvimento:

```bash
npm run dev
```

Validar TypeScript:

```bash
npm run typecheck
```

Gerar build:

```bash
npm run build
```

Executar build:

```bash
npm start
```

Servidor esperado:

```text
http://localhost:3000
```

Rota de saude:

```text
GET http://localhost:3000/health
```

## Executando o Front-End

Com a API rodando, use uma das opcoes:

- Acesse `http://localhost:3000` para abrir o front servido pelo Express.
- Abra `frontend/index.html` no navegador.
- Use Live Server apontando para a pasta `frontend/`.

O JavaScript usa a mesma origem quando a pagina esta em `localhost:3000`. Se for aberta fora da API, ele consome `http://localhost:3000`.

## Endpoints

### Produtos

| Metodo | Endpoint | Descricao |
|---|---|---|
| GET | `/produtos` | Lista produtos |
| GET | `/produtos/:id` | Busca produto por ID |
| POST | `/produtos` | Cria produto com `multipart/form-data` |
| PATCH | `/produtos/:id` | Atualiza produto com JSON |
| DELETE | `/produtos/:id` | Exclui produto |

Campos para criar produto via `FormData`:

```text
nome: string, obrigatorio
descricao: string, opcional
preco: number, obrigatorio
categoriaId: number, obrigatorio
imagem: file, opcional
```

Exemplo de atualizacao de produto:

```json
{
  "nome": "Mouse Gamer",
  "descricao": "Mouse com sensor optico",
  "preco": 149.9,
  "categoriaId": 1
}
```

### Categorias

| Metodo | Endpoint |
|---|---|
| GET | `/categorias` |
| GET | `/categorias/:id` |
| POST | `/categorias` |
| PATCH | `/categorias/:id` |
| DELETE | `/categorias/:id` |

Exemplo JSON:

```json
{
  "nome": "Perifericos",
  "ativo": true
}
```

### Clientes

| Metodo | Endpoint |
|---|---|
| GET | `/clientes` |
| GET | `/clientes/:id` |
| POST | `/clientes` |
| PATCH | `/clientes/:id` |
| DELETE | `/clientes/:id` |

Exemplo JSON:

```json
{
  "nome": "Ana Souza",
  "email": "ana@email.com",
  "telefone": "11999999999",
  "cpf": "111.111.111-11",
  "endereco": "Rua A, 100",
  "ativo": true
}
```

### Vendedores

| Metodo | Endpoint |
|---|---|
| GET | `/vendedores` |
| GET | `/vendedores/:id` |
| POST | `/vendedores` |
| PATCH | `/vendedores/:id` |
| DELETE | `/vendedores/:id` |

Exemplo JSON:

```json
{
  "nome": "Carla Mendes",
  "email": "carla@email.com",
  "telefone": "11999999999",
  "cpf": "333.333.333-33",
  "comissao": 5,
  "ativo": true
}
```

### Pedidos

| Metodo | Endpoint |
|---|---|
| GET | `/pedidos` |
| GET | `/pedidos/:id` |
| GET | `/pedidos/cliente/:idcliente` |
| POST | `/pedidos` |
| PATCH | `/pedidos/:id` |
| DELETE | `/pedidos/:id` |

Exemplo JSON:

```json
{
  "clienteId": 1,
  "vendedorId": 1,
  "status": "pendente",
  "total": 0
}
```

### Itens de pedido

| Metodo | Endpoint |
|---|---|
| GET | `/itenspedidos/pedido/:idpedido` |
| GET | `/itenspedidos/:id` |
| POST | `/itenspedidos` |
| PATCH | `/itenspedidos/:id` |
| DELETE | `/itenspedidos/:id` |

Exemplo JSON:

```json
{
  "pedidoId": 1,
  "produtoId": 1,
  "quantidade": 2,
  "precoUnitario": 89.9
}
```

## Fluxo CRUD do Front-End

1. Ao carregar a pagina, `frontend/script.js` faz `GET /produtos`.
2. A resposta e convertida com `response.json()`.
3. Os produtos sao renderizados dinamicamente com `document.createElement()`.
4. O formulario envia `POST /produtos` para criar novos registros.
5. O botao Editar preenche o formulario e envia `PATCH /produtos/:id`.
6. O botao Excluir envia `DELETE /produtos/:id`.
7. A lista e atualizada novamente via API, sem recarregar a pagina.

## Observacoes importantes

- O back-end usa CORS para permitir front e API em portas diferentes.
- Uploads de imagem sao salvos em `uploads/images/`, pasta ignorada pelo Git.
- Erros de validacao retornam `400`.
- Registros nao encontrados retornam `404`.
- Erros internos retornam JSON com status `500`.
- A porta padrao documentada e `3000`; se alterar `SERVER_PORT`, ajuste tambem o acesso do front quando abrir fora do Express.
