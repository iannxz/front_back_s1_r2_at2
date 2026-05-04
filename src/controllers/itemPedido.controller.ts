import { Request, Response } from "express";
import { ItemPedidoService } from "../services/itemPedido.service";

export class ItemPedidoController {
  constructor(readonly _service = new ItemPedidoService()) {}

  // lista itens de um pedido
  selecionarPorPedido = async (req: Request, res: Response) => {
    try {
      const idpedido = Number(req.params.idpedido);
      const itens = await this._service.selecionarPorPedido(idpedido);
      res.status(200).json({ "itens": itens });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao selecionar itens do pedido", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao selecionar itens do pedido:", error);
    }
  }

  selecionarPorId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const item = await this._service.selecionarPorId(id);
      if (item) {
        res.status(200).json({ item });
      } else {
        res.status(404).json({ message: "Item não encontrado" });
      }
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao selecionar item por ID", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao selecionar item por ID:", error);
    }
  }

  criar = async (req: Request, res: Response) => {
    try {
      const { pedidoId, produtoId, quantidade, precoUnitario } = req.body;
      if (!pedidoId || !produtoId || !quantidade || !precoUnitario) {
        return res.status(400).json({ error: "Campos 'pedidoId', 'produtoId', 'quantidade' e 'precoUnitario' são obrigatórios." });
      }
      const resultado = await this._service.criar(pedidoId, produtoId, quantidade, precoUnitario);
      res.status(201).json({ message: "Item adicionado ao pedido com sucesso", resultado });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao criar item do pedido", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao criar item do pedido:", error);
    }
  }

  editar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { pedidoId, produtoId, quantidade, precoUnitario } = req.body;
      const resultado = await this._service.editar(id, pedidoId, produtoId, quantidade, precoUnitario);
      res.status(200).json({ message: "Item do pedido editado com sucesso", resultado });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao editar item do pedido", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao editar item do pedido:", error);
    }
  }

  deletar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deletado = await this._service.deletar(id);
      if (deletado.affectedRows === 0) {
        return res.status(404).json({ message: "Item não encontrado para deletar" });
      }
      res.status(200).json({ message: "Item deletado com sucesso", deletado });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao deletar item do pedido", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao deletar item do pedido:", error);
    }
  }
}
