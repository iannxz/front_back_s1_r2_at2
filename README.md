# CRUD Loja Informatica

Este repositorio contem:

- backend em Node.js, TypeScript, Express e MySQL;
- frontend estatico em `frontend/` com HTML, CSS e JavaScript puro;
- CRUD completo de produtos consumindo a API real em portugues.

## Estrutura principal

```text
.
|-- docs/
|   |-- database.sql
|-- frontend/
|   |-- index.html
|   |-- style.css
|   |-- script.js
|-- src/
|   |-- controllers/
|   |-- routes/
|   |-- services/
|   |-- repository/
|   |-- server.ts
|-- package.json
|-- README.md
```

## Como rodar o backend

### 1. Instale as dependencias

```bash
npm install
```

### 2. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com os valores do seu MySQL:

```env
SERVER_PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=lojinha_informatica
```

Importante:

- a variavel de porta usada pelo projeto e `SERVER_PORT`;
- o script SQL deste repositorio cria o banco `lojinha_informatica`;
- `DB_NAME` deve bater com o nome real do banco criado no MySQL.

### 3. Execute o script SQL

O script esta em `docs/database.sql`.

Ele cria o banco `lojinha_informatica`, as tabelas e registros iniciais, incluindo mais de 5 produtos para a listagem da atividade.

Exemplo:

```sql
SOURCE docs/database.sql;
```

Se preferir, abra o arquivo e execute o conteudo no seu cliente MySQL.

### 4. Inicie o servidor

```bash
npm run dev
```

Servidor esperado:

```text
http://localhost:3000
```

## CORS

O backend foi ajustado para usar `cors()` em `src/server.ts`.

Isso permite abrir o front-end separado, por exemplo:

- clicando em `frontend/index.html`;
- usando Live Server;
- usando outro servidor estatico local.

## Como abrir o front-end

Com o backend rodando:

1. Abra `frontend/index.html` no navegador.
2. Ou rode o Live Server dentro da pasta `frontend/`.
3. A interface ja consome `http://localhost:3000/produtos`.

## Endpoints reais disponiveis

### Produtos

| Metodo | Endpoint | Uso |
|---|---|---|
| GET | `http://localhost:3000/produtos` | Lista todos os produtos |
| GET | `http://localhost:3000/produtos/:id` | Busca um produto por ID |
| POST | `http://localhost:3000/produtos` | Cria produto com `FormData` |
| PATCH | `http://localhost:3000/produtos/:id` | Edita produto com JSON |
| DELETE | `http://localhost:3000/produtos/:id` | Remove produto |

### Formato do GET `/produtos`

```json
{
  "produtos": [
    {
      "id": 1,
      "nomeprod": "Mouse Logitech GPro2",
      "descricao": "Mouse gamer 8000p",
      "valor": 89.9,
      "imagem": null,
      "idcategoria": 1,
      "ativo": true,
      "dataCad": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

No JavaScript:

```js
const response = await fetch("http://localhost:3000/produtos");
const data = await response.json();
const produtos = data.produtos;
```

## Exemplo simples com fetch()

### GET

```js
async function buscarProdutos() {
  const response = await fetch("http://localhost:3000/produtos");
  const data = await response.json();
  console.log(data.produtos);
}
```

### POST com FormData

```js
async function criarProduto() {
  const formData = new FormData();
  formData.append("nome", "Headset Gamer");
  formData.append("descricao", "Headset com microfone");
  formData.append("preco", "199.90");
  formData.append("categoriaId", "1");

  const response = await fetch("http://localhost:3000/produtos", {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  console.log(data);
}
```

### PATCH com JSON

```js
async function editarProduto(id) {
  const response = await fetch(`http://localhost:3000/produtos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: "Produto editado",
      descricao: "Descricao editada",
      preco: Number(100),
      categoriaId: Number(1)
    })
  });

  const data = await response.json();
  console.log(data);
}
```

## Front-end da atividade

O front-end criado em `frontend/` atende ao CRUD de produtos com:

- HTML, CSS e JavaScript em arquivos separados;
- `fetch()` com `GET`, `POST`, `PATCH` e `DELETE`;
- `response.json()` e tratamento de erro com `try/catch`;
- criacao dinamica de cards com `document.createElement()`;
- manipulacao de `submit` do formulario e cliques nos botoes;
- atualizacao da interface sem recarregar a pagina;
- exibicao de imagem quando existir no backend.
