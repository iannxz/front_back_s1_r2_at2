import { Request, Response } from "express";
import { PedidoService } from "../services/pedido.service";
import {
  badRequest,
  notFound,
  parseNonNegativeNumber,
  parsePositiveInteger,
  requiredString,
  serverError,
} from "../utils/request";

export class PedidoController {
  constructor(readonly _service = new PedidoService()) {}

  selecionarTodos = async (_req: Request, res: Response) => {
    try {
      const pedidos = await this._service.selecionarTodos();
      return res.status(200).json({ pedidos });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar pedidos", error);
    }
  };

  selecionarPorId = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID do pedido invalido.");
      }

      const pedido = await this._service.selecionarPorId(id);
      if (!pedido) {
        return notFound(res, "Pedido nao encontrado.");
      }

      return res.status(200).json({ pedido });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar pedido por ID", error);
    }
  };

  selecionarPorCliente = async (req: Request, res: Response) => {
    try {
      const idcliente = parsePositiveInteger(req.params.idcliente);
      if (!idcliente) {
        return badRequest(res, "ID do cliente invalido.");
      }

      const pedidos = await this._service.selecionarPorCliente(idcliente);
      return res.status(200).json({ pedidos });
    } catch (error: unknown) {
      return serverError(res, "Erro ao buscar pedidos do cliente", error);
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const clienteId = parsePositiveInteger(req.body.clienteId);
      const vendedorId = parsePositiveInteger(req.body.vendedorId);

      if (!clienteId) {
        return badRequest(res, "clienteId deve ser um inteiro maior que zero.");
      }

      if (!vendedorId) {
        return badRequest(res, "vendedorId deve ser um inteiro maior que zero.");
      }

      const resultado = await this._service.criar(clienteId, vendedorId);
      return res.status(201).json({
        message: "Pedido criado com sucesso.",
        id: resultado.insertId,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao criar pedido", error);
    }
  };

  editar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      const clienteId = parsePositiveInteger(req.body.clienteId);
      const vendedorId = parsePositiveInteger(req.body.vendedorId);
      const status = requiredString(req.body.status, 3);
      const total = parseNonNegativeNumber(req.body.total);

      if (!id) {
        return badRequest(res, "ID do pedido invalido.");
      }

      if (!clienteId) {
        return badRequest(res, "clienteId deve ser um inteiro maior que zero.");
      }

      if (!vendedorId) {
        return badRequest(res, "vendedorId deve ser um inteiro maior que zero.");
      }

      if (!status) {
        return badRequest(res, "status deve ter pelo menos 3 caracteres.");
      }

      if (total === null) {
        return badRequest(res, "total deve ser um numero maior ou igual a zero.");
      }

      const resultado = await this._service.editar(
        id,
        clienteId,
        vendedorId,
        status,
        total
      );

      if (resultado.affectedRows === 0) {
        return notFound(res, "Pedido nao encontrado para editar.");
      }

      return res.status(200).json({
        message: "Pedido editado com sucesso.",
        id,
        alterados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao editar pedido", error);
    }
  };

  deletar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID do pedido invalido.");
      }

      const resultado = await this._service.deletar(id);
      if (resultado.affectedRows === 0) {
        return notFound(res, "Pedido nao encontrado para deletar.");
      }

      return res.status(200).json({
        message: "Pedido deletado com sucesso.",
        id,
        deletados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao deletar pedido", error);
    }
  };
}
