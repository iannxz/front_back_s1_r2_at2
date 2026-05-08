const BASE_URL = getApiBaseUrl();
const API_URL = `${BASE_URL}/produtos`;

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
const refreshButton = document.getElementById("refresh-button");
const messageBox = document.getElementById("message");
const productList = document.getElementById("product-list");
const productCount = document.getElementById("product-count");

function getApiBaseUrl() {
  if (window.location.protocol.startsWith("http") && window.location.port === "3000") {
    return window.location.origin;
  }

  return "http://localhost:3000";
}

function showMessage(text, type = "info") {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "message";
}

function formatPrice(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "Preco indisponivel";
  }

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const normalizedPath = image.replace(/^\/+/, "");

  if (normalizedPath.startsWith("uploads/")) {
    return `${BASE_URL}/${normalizedPath}`;
  }

  if (normalizedPath.startsWith("images/")) {
    return `${BASE_URL}/uploads/${normalizedPath}`;
  }

  return `${BASE_URL}/uploads/images/${normalizedPath}`;
}

async function readResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function getErrorMessage(data, fallback) {
  return data.error || data.message || data.errorMessage || fallback;
}

function extractProducts(data) {
  if (Array.isArray(data.produtos)) {
    return data.produtos;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
}

function setSaving(isSaving) {
  submitButton.disabled = isSaving;
  cancelEditButton.disabled = isSaving;

  if (isSaving) {
    submitButton.textContent = "Salvando...";
    return;
  }

  submitButton.textContent = productIdInput.value ? "Salvar" : "Cadastrar";
}

function resetForm() {
  form.reset();
  productIdInput.value = "";
  imageInput.disabled = false;
  formTitle.textContent = "Novo produto";
  submitButton.textContent = "Cadastrar";
  cancelEditButton.hidden = true;
}

function startEdit(product) {
  productIdInput.value = product.id ?? "";
  nameInput.value = product.nomeprod ?? "";
  descriptionInput.value = product.descricao ?? "";
  priceInput.value = product.valor ?? "";
  categoryInput.value = product.idcategoria ?? "";
  imageInput.value = "";
  imageInput.disabled = true;

  formTitle.textContent = "Editar produto";
  submitButton.textContent = "Salvar";
  cancelEditButton.hidden = false;
  showMessage(`Editando: ${product.nomeprod}`, "info");
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function createMeta(label, value) {
  const item = document.createElement("span");
  const strong = document.createElement("strong");

  strong.textContent = `${label}: `;
  item.append(strong, document.createTextNode(value));

  return item;
}

function renderProducts(products) {
  productList.innerHTML = "";
  productCount.textContent = `${products.length} produto(s)`;

  if (products.length === 0) {
    productList.appendChild(
      createTextElement("p", "empty-state", "Nenhum produto cadastrado.")
    );
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageUrl = getImageUrl(product.imagem);
    if (imageUrl) {
      const image = document.createElement("img");
      image.className = "product-image";
      image.src = imageUrl;
      image.alt = `Imagem de ${product.nomeprod}`;
      card.appendChild(image);
    }

    const titleWrapper = document.createElement("div");
    titleWrapper.append(
      createTextElement(
        "h3",
        "product-title",
        product.nomeprod || "Produto sem nome"
      ),
      createTextElement("p", "product-id", `ID ${product.id ?? "-"}`)
    );

    const description = createTextElement(
      "p",
      "product-description",
      product.descricao || "Sem descricao."
    );

    const meta = document.createElement("div");
    meta.className = "product-meta";
    meta.append(
      createMeta("Preco", formatPrice(product.valor)),
      createMeta("Categoria", String(product.idcategoria ?? "-"))
    );

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const editButton = document.createElement("button");
    editButton.className = "button";
    editButton.type = "button";
    editButton.textContent = "Editar";
    editButton.addEventListener("click", () => startEdit(product));

    const deleteButton = document.createElement("button");
    deleteButton.className = "button button-danger";
    deleteButton.type = "button";
    deleteButton.textContent = "Excluir";
    deleteButton.addEventListener("click", () => deleteProduct(product.id));

    actions.append(editButton, deleteButton);
    card.append(titleWrapper, description, meta, actions);
    productList.appendChild(card);
  });
}

async function loadProducts(options = {}) {
  const { keepMessage = false } = options;

  if (!keepMessage) {
    clearMessage();
  }

  productList.innerHTML = "";
  productCount.textContent = "Carregando...";

  try {
    const response = await fetch(API_URL);
    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(data, "Erro ao listar produtos."));
    }

    renderProducts(extractProducts(data));
  } catch (error) {
    productCount.textContent = "Erro ao carregar";
    productList.appendChild(
      createTextElement(
        "p",
        "empty-state",
        "Nao foi possivel carregar os produtos."
      )
    );
    showMessage(
      error instanceof Error ? error.message : "Erro inesperado ao listar produtos.",
      "error"
    );
  }
}

async function createProduct() {
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
  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Erro ao cadastrar produto."));
  }

  return data.message || "Produto cadastrado com sucesso.";
}

async function updateProduct(id) {
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
  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Erro ao editar produto."));
  }

  return data.message || "Produto editado com sucesso.";
}

async function deleteProduct(id) {
  if (!id) {
    showMessage("Produto invalido para exclusao.", "error");
    return;
  }

  if (!window.confirm("Deseja excluir este produto?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(getErrorMessage(data, "Erro ao excluir produto."));
    }

    if (String(productIdInput.value) === String(id)) {
      resetForm();
    }

    await loadProducts({ keepMessage: true });
    showMessage(data.message || "Produto excluido com sucesso.", "success");
  } catch (error) {
    showMessage(
      error instanceof Error ? error.message : "Erro inesperado ao excluir produto.",
      "error"
    );
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = productIdInput.value.trim();
  setSaving(true);

  try {
    const message = id ? await updateProduct(id) : await createProduct();
    resetForm();
    await loadProducts({ keepMessage: true });
    showMessage(message, "success");
  } catch (error) {
    showMessage(
      error instanceof Error ? error.message : "Erro inesperado ao salvar produto.",
      "error"
    );
  } finally {
    setSaving(false);
  }
});

cancelEditButton.addEventListener("click", () => {
  resetForm();
  showMessage("Edicao cancelada.", "info");
});

refreshButton.addEventListener("click", () => loadProducts());

loadProducts();
