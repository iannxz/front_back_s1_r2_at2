import { Request, Response } from "express"; 
import { CategoriaService } from "../services/categoria.service";

export class CategoriaController {
  constructor(readonly _service = new CategoriaService()) { }
    /**
     * 
     * @param req 
     * @param res 
     */
    selecionarTodos = async (req: Request, res: Response) => {
      try {
        const categorias = await this._service.selecionarTodos();
        res.status(200).json({"categorias": categorias});
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao selecionar categorias", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao selecionar categorias:", error);
      }
    }

    selecionarPorId = async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const categoria = await this._service.selecionarPorId(id);
        if (categoria) {
          res.status(200).json({ categoria });
        } else {
          res.status(404).json({ message: "Categoria não encontrada" });
        }
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao selecionar categoria por ID", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao selecionar categoria por ID:", error);
      }
    }

    criar = async (req: Request, res: Response) => {
      try {
        const { nome } = req.body;
        const resultado = await this._service.criar(nome);
        res.status(201).json({ message: "Categoria criada com sucesso", resultado });
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao criar categoria", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao criar categoria:", error);
      }
    }

    editar = async (req: Request, res: Response) => {
      try {
        const { nome, ativo } = req.body;
        const id = Number(req.params.id);
        const alterado = await this._service.editar(id, nome, ativo);
        res.status(200).json({ message: "Categoria editada com sucesso", alterado });
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao editar categoria", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao editar categoria:", error);
      }
    }

    deletar = async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const deletado = await this._service.deletar(id);
        if (deletado.affectedRows === 0) {
          return res.status(404).json({ message: "Categoria não encontrada para deletar" });
        }
        res.status(200).json({ message: "Categoria deletada com sucesso", deletado });
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao deletar categoria", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao deletar categoria:", error);
      }
    }
  }
