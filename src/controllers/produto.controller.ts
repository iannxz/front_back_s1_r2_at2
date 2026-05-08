import { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { ProdutoService } from "../services/produto.service";
import {
  badRequest,
  notFound,
  optionalString,
  parsePositiveInteger,
  parsePositiveNumber,
  requiredString,
  serverError,
} from "../utils/request";

export class ProdutoController {
  constructor(readonly _service = new ProdutoService()) {}

  selecionarTodos = async (_req: Request, res: Response) => {
    try {
      const produtos = await this._service.selecionarTodos();
      return res.status(200).json({ produtos });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar produtos", error);
    }
  };

  selecionarPorId = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID do produto invalido.");
      }

      const produto = await this._service.selecionarPorId(id);
      if (!produto) {
        return notFound(res, "Produto nao encontrado.");
      }

      return res.status(200).json({ produto });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar produto por ID", error);
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const nome = requiredString(req.body.nome, 3);
      const descricao = optionalString(req.body.descricao);
      const preco = parsePositiveNumber(req.body.preco);
      const categoriaId = parsePositiveInteger(req.body.categoriaId);

      if (!nome) {
        this.limparImagem(req);
        return badRequest(res, "Nome deve ter pelo menos 3 caracteres.");
      }

      if (!preco) {
        this.limparImagem(req);
        return badRequest(res, "preco deve ser um numero maior que zero.");
      }

      if (!categoriaId) {
        this.limparImagem(req);
        return badRequest(res, "categoriaId deve ser um inteiro maior que zero.");
      }

      const imagem = req.file ? req.file.filename : undefined;
      const resultado = await this._service.criar(
        nome,
        descricao,
        preco,
        categoriaId,
        imagem
      );

      return res.status(201).json({
        message: "Produto criado com sucesso.",
        id: resultado.insertId,
        imagem: imagem ?? null,
      });
    } catch (error: unknown) {
      this.limparImagem(req);
      return serverError(res, "Erro ao criar produto", error);
    }
  };

  editar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      const nome = requiredString(req.body.nome, 3);
      const descricao = optionalString(req.body.descricao);
      const preco = parsePositiveNumber(req.body.preco);
      const categoriaId = parsePositiveInteger(req.body.categoriaId);

      if (!id) {
        return badRequest(res, "ID do produto invalido.");
      }

      if (!nome) {
        return badRequest(res, "Nome deve ter pelo menos 3 caracteres.");
      }

      if (!preco) {
        return badRequest(res, "preco deve ser um numero maior que zero.");
      }

      if (!categoriaId) {
        return badRequest(res, "categoriaId deve ser um inteiro maior que zero.");
      }

      const resultado = await this._service.editar(
        id,
        nome,
        descricao,
        preco,
        categoriaId
      );

      if (resultado.affectedRows === 0) {
        return notFound(res, "Produto nao encontrado para editar.");
      }

      return res.status(200).json({
        message: "Produto editado com sucesso.",
        id,
        alterados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao editar produto", error);
    }
  };

  deletar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID do produto invalido.");
      }

      const resultado = await this._service.deletar(id);
      if (resultado.affectedRows === 0) {
        return notFound(res, "Produto nao encontrado para deletar.");
      }

      return res.status(200).json({
        message: "Produto deletado com sucesso.",
        id,
        deletados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao deletar produto", error);
    }
  };

  private limparImagem(req: Request): void {
    if (!req.file) {
      return;
    }

    const imagePath = path.resolve("uploads/images", req.file.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
}
