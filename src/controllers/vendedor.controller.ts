import { Request, Response } from "express";
import { VendedorService } from "../services/vendedor.service";
import {
  badRequest,
  notFound,
  optionalString,
  parseBoolean,
  parseNonNegativeNumber,
  parsePositiveInteger,
  requiredString,
  serverError,
} from "../utils/request";

export class VendedorController {
  constructor(readonly _service = new VendedorService()) {}

  selecionarTodos = async (_req: Request, res: Response) => {
    try {
      const vendedores = await this._service.selecionarTodos();
      return res.status(200).json({ vendedores });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar vendedores", error);
    }
  };

  selecionarPorId = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID do vendedor invalido.");
      }

      const vendedor = await this._service.selecionarPorId(id);
      if (!vendedor) {
        return notFound(res, "Vendedor nao encontrado.");
      }

      return res.status(200).json({ vendedor });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar vendedor por ID", error);
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const nome = requiredString(req.body.nome, 3);
      const email = requiredString(req.body.email, 5);
      const cpf = requiredString(req.body.cpf, 3);
      const telefone = optionalString(req.body.telefone);
      const comissao = parseNonNegativeNumber(req.body.comissao ?? 0);

      if (!nome) {
        return badRequest(res, "Nome do vendedor deve ter pelo menos 3 caracteres.");
      }

      if (!email || !email.includes("@")) {
        return badRequest(res, "Email do vendedor invalido.");
      }

      if (!cpf) {
        return badRequest(res, "CPF do vendedor e obrigatorio.");
      }

      if (comissao === null || comissao > 100) {
        return badRequest(res, "comissao deve ser um numero entre 0 e 100.");
      }

      const resultado = await this._service.criar(nome, email, telefone, cpf, comissao);
      return res.status(201).json({
        message: "Vendedor criado com sucesso.",
        id: resultado.insertId,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao criar vendedor", error);
    }
  };

  editar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      const nome = requiredString(req.body.nome, 3);
      const email = requiredString(req.body.email, 5);
      const cpf = requiredString(req.body.cpf, 3);
      const telefone = optionalString(req.body.telefone);
      const comissao = parseNonNegativeNumber(req.body.comissao);
      const ativo = parseBoolean(req.body.ativo, true);

      if (!id) {
        return badRequest(res, "ID do vendedor invalido.");
      }

      if (!nome) {
        return badRequest(res, "Nome do vendedor deve ter pelo menos 3 caracteres.");
      }

      if (!email || !email.includes("@")) {
        return badRequest(res, "Email do vendedor invalido.");
      }

      if (!cpf) {
        return badRequest(res, "CPF do vendedor e obrigatorio.");
      }

      if (comissao === null || comissao > 100) {
        return badRequest(res, "comissao deve ser um numero entre 0 e 100.");
      }

      if (ativo === null) {
        return badRequest(res, "ativo deve ser booleano.");
      }

      const resultado = await this._service.editar(
        id,
        nome,
        email,
        telefone,
        cpf,
        comissao,
        ativo
      );

      if (resultado.affectedRows === 0) {
        return notFound(res, "Vendedor nao encontrado para editar.");
      }

      return res.status(200).json({
        message: "Vendedor editado com sucesso.",
        id,
        alterados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao editar vendedor", error);
    }
  };

  deletar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID do vendedor invalido.");
      }

      const resultado = await this._service.deletar(id);
      if (resultado.affectedRows === 0) {
        return notFound(res, "Vendedor nao encontrado para deletar.");
      }

      return res.status(200).json({
        message: "Vendedor deletado com sucesso.",
        id,
        deletados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao deletar vendedor", error);
    }
  };
}
