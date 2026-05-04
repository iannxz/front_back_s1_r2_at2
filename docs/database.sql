CREATE DATABASE lojinha_informatica;
USE lojinha_informatica;

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(45) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomeprod VARCHAR(100) NOT NULL,
  descricao VARCHAR(255),
  valor DECIMAL(10,2) NOT NULL,
  imagem VARCHAR(255),
  idcategoria INT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idcategoria) REFERENCES categorias(id)
);

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefone VARCHAR(20),
  cpf VARCHAR(14) NOT NULL,
  endereco VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendedores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telefone VARCHAR(20),
  cpf VARCHAR(14) NOT NULL,
  comissao DECIMAL(5,2) DEFAULT 0.00,
  ativo BOOLEAN DEFAULT TRUE,
  dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idcliente INT NOT NULL,
  idvendedor INT NOT NULL,
  dataPedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(30) DEFAULT 'pendente',
  total DECIMAL(10,2) DEFAULT 0.00,
  ativo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (idcliente) REFERENCES clientes(id),
  FOREIGN KEY (idvendedor) REFERENCES vendedores(id)
);

CREATE TABLE itenspedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idpedido INT NOT NULL,
  idproduto INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  precoUnitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (idpedido) REFERENCES pedidos(id),
  FOREIGN KEY (idproduto) REFERENCES produtos(id)
);

INSERT INTO categorias (nome) VALUES ('Perifericos');
INSERT INTO categorias (nome) VALUES ('Componentes');
INSERT INTO categorias (nome) VALUES ('Notebooks');
INSERT INTO categorias (nome) VALUES ('Monitores');

INSERT INTO produtos (nomeprod, descricao, valor, idcategoria) VALUES ('Mouse Logitech GPro2', 'Mouse gamer 8000p', 89.90, 1);
INSERT INTO produtos (nomeprod, descricao, valor, idcategoria) VALUES ('Teclado Magnético', 'Tecladp Magnético AULA F75', 249.90, 1);
INSERT INTO produtos (nomeprod, descricao, valor, idcategoria) VALUES ('Placa de Video RTX 3060', 'GPU para jogos', 1899.00, 2);
INSERT INTO produtos (nomeprod, descricao, valor, idcategoria) VALUES ('Monitor LG 24pol IPS', 'Monitor  144hz gamer', 699.90, 4);
INSERT INTO produtos (nomeprod, descricao, valor, idcategoria) VALUES ('Notebook Gamer', 'Notebook gamer positivo 2gb', 1200.00, 3);

INSERT INTO categorias (nome) VALUES ('Cadeiras');
INSERT INTO produtos (nomeprod, descricao, valor, idcategoria) VALUES ('Cadeira Gamer', 'Cadeira Gamer Roxa Confortável', 799.00, 5);
