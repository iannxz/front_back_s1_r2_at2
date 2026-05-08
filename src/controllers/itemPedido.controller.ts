import { Request, Response } from "express";
import { ItemPedidoService } from "../services/itemPedido.service";
import {
  badRequest,
  notFound,
  parsePositiveInteger,
  parsePositiveNumber,
  serverError,
} from "../utils/request";

export class ItemPedidoController {
  constructor(readonly _service = new ItemPedidoService()) {}

  selecionarPorPedido = async (req: Request, res: Response) => {
    try {
      const idpedido = parsePositiveInteger(req.params.idpedido);
      if (!idpedido) {
        return badRequest(res, "ID do pedido invalido.");
      }

      const itens = await this._service.selecionarPorPedido(idpedido);
      return res.status(200).json({ itens });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar itens do pedido", error);
    }
  };

  selecionarPorId = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID do item invalido.");
      }

      const item = await this._service.selecionarPorId(id);
      if (!item) {
        return notFound(res, "Item nao encontrado.");
      }

      return res.status(200).json({ item });
    } catch (error: unknown) {
      return serverError(res, "Erro ao selecionar item por ID", error);
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const pedidoId = parsePositiveInteger(req.body.pedidoId);
      const produtoId = parsePositiveInteger(req.body.produtoId);
      const quantidade = parsePositiveInteger(req.body.quantidade);
      const precoUnitario = parsePositiveNumber(req.body.precoUnitario);

      const validationError = this.validarItem(
        pedidoId,
        produtoId,
        quantidade,
        precoUnitario
      );
      if (validationError) {
        return badRequest(res, validationError);
      }

      const resultado = await this._service.criar(
        pedidoId!,
        produtoId!,
        quantidade!,
        precoUnitario!
      );

      return res.status(201).json({
        message: "Item adicionado ao pedido com sucesso.",
        id: resultado.insertId,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao criar item do pedido", error);
    }
  };

  editar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      const pedidoId = parsePositiveInteger(req.body.pedidoId);
      const produtoId = parsePositiveInteger(req.body.produtoId);
      const quantidade = parsePositiveInteger(req.body.quantidade);
      const precoUnitario = parsePositiveNumber(req.body.precoUnitario);

      if (!id) {
        return badRequest(res, "ID do item invalido.");
      }

      const validationError = this.validarItem(
        pedidoId,
        produtoId,
        quantidade,
        precoUnitario
      );
      if (validationError) {
        return badRequest(res, validationError);
      }

      const resultado = await this._service.editar(
        id,
        pedidoId!,
        produtoId!,
        quantidade!,
        precoUnitario!
      );

      if (resultado.affectedRows === 0) {
        return notFound(res, "Item nao encontrado para editar.");
      }

      return res.status(200).json({
        message: "Item do pedido editado com sucesso.",
        id,
        alterados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao editar item do pedido", error);
    }
  };

  deletar = async (req: Request, res: Response) => {
    try {
      const id = parsePositiveInteger(req.params.id);
      if (!id) {
        return badRequest(res, "ID do item invalido.");
      }

      const resultado = await this._service.deletar(id);
      if (resultado.affectedRows === 0) {
        return notFound(res, "Item nao encontrado para deletar.");
      }

      return res.status(200).json({
        message: "Item deletado com sucesso.",
        id,
        deletados: resultado.affectedRows,
      });
    } catch (error: unknown) {
      return serverError(res, "Erro ao deletar item do pedido", error);
    }
  };

  private validarItem(
    pedidoId: number | null,
    produtoId: number | null,
    quantidade: number | null,
    precoUnitario: number | null
  ): string | null {
    if (!pedidoId) {
      return "pedidoId deve ser um inteiro maior que zero.";
    }

    if (!produtoId) {
      return "produtoId deve ser um inteiro maior que zero.";
    }

    if (!quantidade) {
      return "quantidade deve ser um inteiro maior que zero.";
    }

    if (!precoUnitario) {
      return "precoUnitario deve ser um numero maior que zero.";
    }

    return null;
  }
}
