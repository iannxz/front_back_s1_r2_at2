import { Request, Response } from "express";
import { PedidoService } from "../services/pedido.service";

export class PedidoController {
  constructor(readonly _service = new PedidoService()) {}

  selecionarTodos = async (req: Request, res: Response) => {
    try {
      const pedidos = await this._service.selecionarTodos();
      res.status(200).json({ "pedidos": pedidos });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao selecionar pedidos", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao selecionar pedidos:", error);
    }
  }

  selecionarPorId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const pedido = await this._service.selecionarPorId(id);
      if (pedido) {
        res.status(200).json({ pedido });
      } else {
        res.status(404).json({ message: "Pedido não encontrado" });
      }
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao selecionar pedido por ID", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao selecionar pedido por ID:", error);
    }
  }

  // busca pedidos por cliente
  selecionarPorCliente = async (req: Request, res: Response) => {
    try {
      const idcliente = Number(req.params.idcliente);
      const pedidos = await this._service.selecionarPorCliente(idcliente);
      if (pedidos.length === 0) {
        return res.status(404).json({ message: "Nenhum pedido encontrado para esse cliente" });
      }
      return res.status(200).json({ pedidos });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao buscar pedidos do cliente", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao buscar pedidos do cliente:", error);
    }
  }

  criar = async (req: Request, res: Response) => {
    try {
      const { clienteId, vendedorId } = req.body;
      if (!clienteId || !vendedorId) {
        return res.status(400).json({ error: "Campos 'clienteId' e 'vendedorId' são obrigatórios." });
      }
      const resultado = await this._service.criar(clienteId, vendedorId);
      res.status(201).json({ message: "Pedido criado com sucesso", id: resultado.insertId });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao criar pedido", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao criar pedido:", error);
    }
  }

  editar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { clienteId, vendedorId, status, total } = req.body;
      const resultado = await this._service.editar(id, clienteId, vendedorId, status, total);
      res.status(200).json({ message: "Pedido editado com sucesso", resultado });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao editar pedido", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao editar pedido:", error);
    }
  }

  deletar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deletado = await this._service.deletar(id);
      if (deletado.affectedRows === 0) {
        return res.status(404).json({ message: "Pedido não encontrado para deletar" });
      }
      res.status(200).json({ message: "Pedido deletado com sucesso", deletado });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao deletar pedido", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao deletar pedido:", error);
    }
  }
}
