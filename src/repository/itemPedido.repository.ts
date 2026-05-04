import { db } from "../database/db.connection";
import { IitemPedido } from "../models/itemPedido.model";
import { ResultSetHeader } from "mysql2";

export class ItemPedidoRepository {
  // busca todos os itens de um pedido especifico
  async findByPedido(idpedido: number): Promise<IitemPedido[]> {
    const sql = "SELECT * FROM itenspedidos WHERE idpedido = ?;";
    const values = [idpedido];
    const [rows] = await db.execute<IitemPedido[]>(sql, values);
    return rows;
  }

  async findById(id: number): Promise<IitemPedido | null> {
    const sql = "SELECT * FROM itenspedidos WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<IitemPedido[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
  }

  async create(dados: Omit<IitemPedido, 'id'>): Promise<ResultSetHeader> {
    const sql = "INSERT INTO itenspedidos (idpedido, idproduto, quantidade, precoUnitario, subtotal) VALUES (?, ?, ?, ?, ?);";
    const values = [dados.PedidoId, dados.ProdutoId, dados.Quantidade, dados.PrecoUnitario, dados.Subtotal];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async update(id: number, dados: Omit<IitemPedido, 'id'>): Promise<ResultSetHeader> {
    const sql = "UPDATE itenspedidos SET idpedido = ?, idproduto = ?, quantidade = ?, precoUnitario = ?, subtotal = ? WHERE id = ?;";
    const values = [dados.PedidoId, dados.ProdutoId, dados.Quantidade, dados.PrecoUnitario, dados.Subtotal, id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async delete(id: number): Promise<ResultSetHeader> {
    const sql = "DELETE FROM itenspedidos WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}
