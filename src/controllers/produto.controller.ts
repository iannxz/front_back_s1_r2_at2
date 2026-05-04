import { Request, Response } from "express"; 
import { ProdutoService } from "../services/produto.service";
import fs from "node:fs";
import path from "node:path";

export class ProdutoController {
  constructor(readonly _service = new ProdutoService()) { }
    selecionarTodos = async (req: Request, res: Response) => {
      try {
        const produtos = await this._service.selecionarTodos();
        res.status(200).json({"produtos": produtos});
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao selecionar produtos", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao selecionar produtos:", error);
      }
    }

    selecionarPorId = async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const produto = await this._service.selecionarPorId(id);
        if (produto) {
          res.status(200).json({ produto });
        } else {
          res.status(404).json({ message: "Produto não encontrado" });
        }
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao selecionar produto por ID", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao selecionar produto por ID:", error);
      }
    }

    // criar: recebe form-data com campo imagem
   
    criar = async (req: Request, res: Response) => {
      try {
        const nome: string = req.body.nome;
        const descricao: string = req.body.descricao ?? "";
        const preco: string = req.body.preco;
        const categoriaId: string = req.body.categoriaId;

        if (!nome || !preco || !categoriaId) {
          this.limparImagem(req);
          return res.status(400).json({
            error: "Campos obrigatórios: 'nome', 'preco' e 'categoriaId'.",
          });
        }

        const precoNum = Number.parseFloat(preco);
        if (Number.isNaN(precoNum) || precoNum <= 0) {
          this.limparImagem(req);
          return res.status(400).json({ error: "preco deve ser um número maior que zero." });
        }

        const categoriaIdNum = Number.parseInt(categoriaId);
        if (Number.isNaN(categoriaIdNum) || categoriaIdNum <= 0) {
          this.limparImagem(req);
          return res.status(400).json({ error: "categoriaId deve ser um número inteiro maior que zero." });
        }

        const imagem = req.file ? req.file.filename : undefined;

        const resultado = await this._service.criar(nome, descricao, precoNum, categoriaIdNum, imagem);

        res.status(201).json({
          message: "Produto criado com sucesso",
          id: resultado.insertId,
          imagem: req.file ? req.file.filename : null,
        });
      } catch (error: unknown) {
        this.limparImagem(req); 
        res.status(500).json({ error: "Erro ao criar produto", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao criar produto:", error);
      }
    }

    private limparImagem(req: Request): void {
      if (req.file) {
        const imagePath = path.resolve("uploads/images", req.file.filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    editar = async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const { nome, descricao, preco, categoriaId } = req.body;
        if (!nome || typeof nome !== 'string' || typeof preco !== 'number' || typeof categoriaId !== 'number') {
          return res.status(400).json({ error: "Parâmetros 'nome', 'preco' e 'categoriaId' são obrigatórios e devem ser do tipo correto." });
        }
        const resultado = await this._service.editar(id, nome, descricao ?? "", preco, categoriaId);
        res.status(200).json({ message: "Produto editado com sucesso", id: resultado.affectedRows });
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao editar produto", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao editar produto:", error);
      }
    }

    deletar = async (req: Request, res: Response) => {
      try {        const id = Number(req.params.id);
        const resultado = await this._service.deletar(id);
        res.status(200).json({ message: "Produto deletado com sucesso", id: resultado.affectedRows });
      } catch (error: unknown) {
        res.status(500).json({ error: "Erro ao deletar produto", errorMessage: error instanceof Error ? error.message : "Erro desconhecido" });
        console.error("Erro ao deletar produto:", error);
      }
    }
}
