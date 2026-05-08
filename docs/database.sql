CREATE DATABASE IF NOT EXISTS lojinha_informatica
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lojinha_informatica;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS itenspedidos;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS vendedores;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS categorias;
SET FOREIGN_KEY_CHECKS = 1;

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
  CONSTRAINT fk_produtos_categorias
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
  CONSTRAINT fk_pedidos_clientes
    FOREIGN KEY (idcliente) REFERENCES clientes(id),
  CONSTRAINT fk_pedidos_vendedores
    FOREIGN KEY (idvendedor) REFERENCES vendedores(id)
);

CREATE TABLE itenspedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idpedido INT NOT NULL,
  idproduto INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  precoUnitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_itenspedidos_pedidos
    FOREIGN KEY (idpedido) REFERENCES pedidos(id),
  CONSTRAINT fk_itenspedidos_produtos
    FOREIGN KEY (idproduto) REFERENCES produtos(id)
);

INSERT INTO categorias (nome) VALUES
  ('Perifericos'),
  ('Componentes'),
  ('Notebooks'),
  ('Monitores'),
  ('Cadeiras');

INSERT INTO produtos (nomeprod, descricao, valor, idcategoria) VALUES
  ('Mouse Logitech GPro2', 'Mouse gamer 8000 DPI', 89.90, 1),
  ('Teclado Magnetico', 'Teclado magnetico AULA F75', 249.90, 1),
  ('Placa de Video RTX 3060', 'GPU para jogos e edicao', 1899.00, 2),
  ('Monitor LG 24pol IPS', 'Monitor gamer 144 Hz', 699.90, 4),
  ('Notebook Gamer', 'Notebook gamer de entrada', 1200.00, 3),
  ('Cadeira Gamer', 'Cadeira gamer confortavel', 799.00, 5);

INSERT INTO clientes (nome, email, telefone, cpf, endereco) VALUES
  ('Ana Souza', 'ana.souza@email.com', '11999990001', '111.111.111-11', 'Rua A, 100'),
  ('Bruno Lima', 'bruno.lima@email.com', '11999990002', '222.222.222-22', 'Rua B, 200');

INSERT INTO vendedores (nome, email, telefone, cpf, comissao) VALUES
  ('Carla Mendes', 'carla.mendes@email.com', '11999990003', '333.333.333-33', 5.00),
  ('Diego Rocha', 'diego.rocha@email.com', '11999990004', '444.444.444-44', 7.50);
