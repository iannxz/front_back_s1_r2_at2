import { Request, Response } from "express";
import { VendedorService } from "../services/vendedor.service";

export class VendedorController {
  constructor(readonly _service = new VendedorService()) {}

  selecionarTodos = async (req: Request, res: Response) => {
    try {
      const vendedores = await this._service.selecionarTodos();
      res.status(200).json({ "vendedores": vendedores });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao selecionar vendedores", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao selecionar vendedores:", error);
    }
  }

  selecionarPorId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const vendedor = await this._service.selecionarPorId(id);
      if (vendedor) {
        res.status(200).json({ vendedor });
      } else {
        res.status(404).json({ message: "Vendedor não encontrado" });
      }
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao selecionar vendedor por ID", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao selecionar vendedor por ID:", error);
    }
  }

  criar = async (req: Request, res: Response) => {
    try {
      const { nome, email, telefone, cpf, comissao } = req.body;
      if (!nome || !email || !cpf) {
        return res.status(400).json({ error: "Campos 'nome', 'email' e 'cpf' são obrigatórios." });
      }
      const resultado = await this._service.criar(nome, email, telefone ?? "", cpf, comissao ?? 0);
      res.status(201).json({ message: "Vendedor criado com sucesso", resultado });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao criar vendedor", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao criar vendedor:", error);
    }
  }

  editar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nome, email, telefone, cpf, comissao, ativo } = req.body;
      const resultado = await this._service.editar(id, nome, email, telefone, cpf, comissao, ativo);
      res.status(200).json({ message: "Vendedor editado com sucesso", resultado });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao editar vendedor", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao editar vendedor:", error);
    }
  }

  deletar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deletado = await this._service.deletar(id);
      if (deletado.affectedRows === 0) {
        return res.status(404).json({ message: "Vendedor não encontrado para deletar" });
      }
      res.status(200).json({ message: "Vendedor deletado com sucesso", deletado });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao deletar vendedor", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao deletar vendedor:", error);
    }
  }
}
