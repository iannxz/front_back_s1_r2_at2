import { Request, Response } from "express";
import { ClienteService } from "../services/cliente.service";
import {
  badRequest,
  notFound,
  optionalString,
  parseBoolean,
  parsePositiveInteger,
  requiredString,
  serverError,
} from "../utils/request";

export class ClienteController {
  constructor(readonly _service = new ClienteService()) {}

  selecionarTodos = async (_req: Request, res: Response) => {
    try {
      const clientes = await this._service.selecionarTodos();
      return res.status(200).json({ clientes });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar clientes", error);
    }
  };

  selecionarPorId = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID do cliente invalido.");
      }

      const cliente = await this._service.selecionarPorId(id);
      if (!cliente) {
        return notFound(res, "Cliente nao encontrado.");
      }

      return res.status(200).json({ cliente });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar cliente por ID", error);
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const nome = requiredString(req.body.nome, 3);
      const email = requiredString(req.body.email, 5);
      const cpf = requiredString(req.body.cpf, 3);
      const telefone = optionalString(req.body.telefone);
      const endereco = optionalString(req.body.endereco);

      if (!nome) {
        return badRequest(res, "Nome do cliente deve ter pelo menos 3 caracteres.");
      }

      if (!email || !email.includes("@")) {
        return badRequest(res, "Email do cliente invalido.");
      }

      if (!cpf) {
        return badRequest(res, "CPF do cliente e obrigatorio.");
      }

      const resultado = await this._service.criar(nome, email, telefone, cpf, endereco);
      return res.status(201).json({
        message: "Cliente criado com sucesso.",
        id: resultado.insertId,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao criar cliente", error);
    }
  };

  editar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      const nome = requiredString(req.body.nome, 3);
      const email = requiredString(req.body.email, 5);
      const cpf = requiredString(req.body.cpf, 3);
      const telefone = optionalString(req.body.telefone);
      const endereco = optionalString(req.body.endereco);
      const ativo = parseBoolean(req.body.ativo, true);

      if (!id) {
        return badRequest(res, "ID do cliente invalido.");
      }

      if (!nome) {
        return badRequest(res, "Nome do cliente deve ter pelo menos 3 caracteres.");
      }

      if (!email || !email.includes("@")) {
        return badRequest(res, "Email do cliente invalido.");
      }

      if (!cpf) {
        return badRequest(res, "CPF do cliente e obrigatorio.");
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
        endereco,
        ativo
      );

      if (resultado.affectedRows === 0) {
        return notFound(res, "Cliente nao encontrado para editar.");
      }

      return res.status(200).json({
        message: "Cliente editado com sucesso.",
        id,
        alterados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao editar cliente", error);
    }
  };

  deletar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID do cliente invalido.");
      }

      const resultado = await this._service.deletar(id);
      if (resultado.affectedRows === 0) {
        return notFound(res, "Cliente nao encontrado para deletar.");
      }

      return res.status(200).json({
        message: "Cliente deletado com sucesso.",
        id,
        deletados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao deletar cliente", error);
    }
  };
}
