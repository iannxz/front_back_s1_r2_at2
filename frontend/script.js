const API_URL = "http://localhost:3000/produtos";
const BASE_URL = "http://localhost:3000";

const form = document.getElementById("produto-form");
const productIdInput = document.getElementById("produto-id");
const nameInput = document.getElementById("nome");
const descriptionInput = document.getElementById("descricao");
const priceInput = document.getElementById("preco");
const categoryInput = document.getElementById("categoriaId");
const imageInput = document.getElementById("imagem");
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const cancelEditButton = document.getElementById("cancel-edit");
const messageBox = document.getElementById("message");
const productList = document.getElementById("product-list");
const productCount = document.getElementById("product-count");

function mostrarMensagem(texto, tipo) {
  messageBox.textContent = texto;
  messageBox.className = `message ${tipo}`;
}

function limparMensagem() {
  messageBox.textContent = "";
  messageBox.className = "message";
}

function formatarPreco(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) {
    return "Preco invalido";
  }

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data) {
  if (!data) {
    return "Nao informada";
  }

  const dataConvertida = new Date(data);
  if (Number.isNaN(dataConvertida.getTime())) {
    return "Nao informada";
  }

  return dataConvertida.toLocaleDateString("pt-BR");
}

function obterImagemUrl(imagem) {
  if (!imagem) {
    return "";
  }

  if (imagem.startsWith("http://") || imagem.startsWith("https://")) {
    return imagem;
  }

  const caminhoNormalizado = imagem.replace(/^\/+/, "");

  if (caminhoNormalizado.startsWith("uploads/")) {
    return `${BASE_URL}/${caminhoNormalizado}`;
  }

  if (caminhoNormalizado.startsWith("images/")) {
    return `${BASE_URL}/uploads/${caminhoNormalizado}`;
  }

  return `${BASE_URL}/uploads/images/${caminhoNormalizado}`;
}

async function lerResposta(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function criarMetaLinha(rotulo, valor) {
  const linha = document.createElement("div");
  linha.className = "meta-line";

  const label = document.createElement("span");
  label.className = "meta-label";
  label.textContent = rotulo;

  const value = document.createElement("span");
  value.className = "meta-value";
  value.textContent = valor;

  linha.append(label, value);
  return linha;
}

async function listarProdutos() {
  productList.innerHTML = "";
  productCount.textContent = "Carregando...";
  limparMensagem();

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Erro ao listar produtos.");
    }

    const produtos = Array.isArray(data.produtos) ? data.produtos : [];
    productCount.textContent = `${produtos.length} produto(s)`;

    if (produtos.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.textContent = "Nenhum produto cadastrado no momento.";
      productList.appendChild(emptyState);
      return;
    }

    produtos.forEach((produto) => {
      const ativo =
        produto.ativo === true ||
        produto.ativo === 1 ||
        produto.ativo === "1";

      const card = document.createElement("article");
      card.className = "product-card";

      if (produto.imagem) {
        const image = document.createElement("img");
        image.className = "product-image";
        image.src = obterImagemUrl(produto.imagem);
        image.alt = `Imagem do produto ${produto.nomeprod}`;
        card.appendChild(image);
      }

      const top = document.createElement("div");
      top.className = "product-top";

      const titleWrap = document.createElement("div");
      const title = document.createElement("h3");
      title.className = "product-title";
      title.textContent = produto.nomeprod;

      const idText = document.createElement("p");
      idText.className = "product-id";
      idText.textContent = `ID: ${produto.id ?? "-"}`;

      titleWrap.append(title, idText);

      const status = document.createElement("span");
      status.className = `status-badge ${ativo ? "" : "inactive"}`.trim();
      status.textContent = ativo ? "Ativo" : "Inativo";

      top.append(titleWrap, status);

      const description = document.createElement("p");
      description.className = "product-description";
      description.textContent = produto.descricao || "Sem descricao informada.";

      const meta = document.createElement("div");
      meta.className = "product-meta";
      meta.append(
        criarMetaLinha("Preco", formatarPreco(produto.valor)),
        criarMetaLinha("Categoria", String(produto.idcategoria ?? "-")),
        criarMetaLinha("Cadastro", formatarData(produto.dataCad))
      );

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "btn btn-edit";
      editButton.textContent = "Editar";
      editButton.addEventListener("click", () => prepararEdicao(produto));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn btn-delete";
      deleteButton.textContent = "Excluir";
      deleteButton.addEventListener("click", () => excluirProduto(produto.id));

      actions.append(editButton, deleteButton);
      card.append(top, description, meta, actions);
      productList.appendChild(card);
    });
  } catch (error) {
    productCount.textContent = "Erro ao carregar";
    mostrarMensagem(
      error instanceof Error ? error.message : "Nao foi possivel listar os produtos.",
      "error"
    );
  }
}

async function criarProduto() {
  try {
    const formData = new FormData();
    formData.append("nome", nameInput.value.trim());
    formData.append("descricao", descriptionInput.value.trim());
    formData.append("preco", priceInput.value.trim());
    formData.append("categoriaId", categoryInput.value.trim());

    if (imageInput.files[0]) {
      formData.append("imagem", imageInput.files[0]);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    const data = await lerResposta(response);

    if (!response.ok) {
      throw new Error(data.error || data.message || "Erro ao criar produto.");
    }

    limparFormulario();
    mostrarMensagem(data.message || "Produto cadastrado com sucesso.", "success");
    await listarProdutos();
    mostrarMensagem(data.message || "Produto cadastrado com sucesso.", "success");
  } catch (error) {
    mostrarMensagem(
      error instanceof Error ? error.message : "Nao foi possivel criar o produto.",
      "error"
    );
  }
}

async function editarProduto(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: nameInput.value.trim(),
        descricao: descriptionInput.value.trim(),
        preco: Number(priceInput.value),
        categoriaId: Number(categoryInput.value),
      }),
    });

    const data = await lerResposta(response);

    if (!response.ok) {
      throw new Error(data.error || data.message || "Erro ao editar produto.");
    }

    limparFormulario();
    mostrarMensagem(data.message || "Produto editado com sucesso.", "success");
    await listarProdutos();
    mostrarMensagem(data.message || "Produto editado com sucesso.", "success");
  } catch (error) {
    mostrarMensagem(
      error instanceof Error ? error.message : "Nao foi possivel editar o produto.",
      "error"
    );
  }
}

async function excluirProduto(id) {
  if (!id) {
    mostrarMensagem("Produto invalido para exclusao.", "error");
    return;
  }

  const confirmou = window.confirm("Deseja realmente excluir este produto?");
  if (!confirmou) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    const data = await lerResposta(response);

    if (!response.ok) {
      throw new Error(data.error || data.message || "Erro ao excluir produto.");
    }

    if (String(productIdInput.value) === String(id)) {
      limparFormulario();
    }

    await listarProdutos();
    mostrarMensagem(data.message || "Produto excluido com sucesso.", "success");
  } catch (error) {
    mostrarMensagem(
      error instanceof Error ? error.message : "Nao foi possivel excluir o produto.",
      "error"
    );
  }
}

function prepararEdicao(produto) {
  productIdInput.value = produto.id ?? "";
  nameInput.value = produto.nomeprod ?? "";
  descriptionInput.value = produto.descricao ?? "";
  priceInput.value = produto.valor ?? "";
  categoryInput.value = produto.idcategoria ?? "";
  imageInput.value = "";

  formTitle.textContent = "Editar Produto";
  submitButton.textContent = "Salvar alteracoes";
  cancelEditButton.hidden = false;

  mostrarMensagem(`Editando o produto "${produto.nomeprod}".`, "success");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function limparFormulario() {
  form.reset();
  productIdInput.value = "";
  formTitle.textContent = "Cadastrar Produto";
  submitButton.textContent = "Cadastrar";
  cancelEditButton.hidden = true;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const produtoId = productIdInput.value.trim();

  if (produtoId) {
    await editarProduto(produtoId);
    return;
  }

  await criarProduto();
});

cancelEditButton.addEventListener("click", () => {
  limparFormulario();
  mostrarMensagem("Edicao cancelada.", "success");
});

listarProdutos();
