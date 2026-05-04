import { Request, Response } from "express";
import { ClienteService } from "../services/cliente.service";

export class ClienteController {
  constructor(readonly _service = new ClienteService()) {}

  selecionarTodos = async (req: Request, res: Response) => {
    try {
      const clientes = await this._service.selecionarTodos();
      res.status(200).json({ "clientes": clientes });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao selecionar clientes", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao selecionar clientes:", error);
    }
  }

  selecionarPorId = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const cliente = await this._service.selecionarPorId(id);
      if (cliente) {
        res.status(200).json({ cliente });
      } else {
        res.status(404).json({ message: "Cliente não encontrado" });
      }
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao selecionar cliente por ID", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao selecionar cliente por ID:", error);
    }
  }

  criar = async (req: Request, res: Response) => {
    try {
      const { nome, email, telefone, cpf, endereco } = req.body;
      if (!nome || !email || !cpf) {
        return res.status(400).json({ error: "Campos 'nome', 'email' e 'cpf' são obrigatórios." });
      }
      const resultado = await this._service.criar(nome, email, telefone ?? "", cpf, endereco ?? "");
      res.status(201).json({ message: "Cliente criado com sucesso", resultado });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao criar cliente", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao criar cliente:", error);
    }
  }

  editar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nome, email, telefone, cpf, endereco, ativo } = req.body;
      const resultado = await this._service.editar(id, nome, email, telefone, cpf, endereco, ativo);
      res.status(200).json({ message: "Cliente editado com sucesso", resultado });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao editar cliente", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao editar cliente:", error);
    }
  }


  deletar = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deletado = await this._service.deletar(id);
      if (deletado.affectedRows === 0) {
        return res.status(404).json({ message: "Cliente não encontrado para deletar" });
      }
      res.status(200).json({ message: "Cliente deletado com sucesso", deletado });
    } catch (error: unknown) {
      res.status(500).json({ error: "Erro ao deletar cliente", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
      console.error("Erro ao deletar cliente:", error);
    }
  }
}
