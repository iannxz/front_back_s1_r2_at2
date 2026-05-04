import { db } from "../database/db.connection";
import { Ipedido } from "../models/pedido.model";
import { ResultSetHeader } from "mysql2";

export class PedidoRepository {
  async findAll(): Promise<Ipedido[]> {
    const [rows] = await db.execute<Ipedido[]>("SELECT * FROM pedidos ORDER BY id DESC;");
    return rows;
  }

  async findById(id: number): Promise<Ipedido | null> {
    const sql = "SELECT * FROM pedidos WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<Ipedido[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
  }

  // busca pedidos de um cliente especifico
  async findByCliente(idcliente: number): Promise<Ipedido[]> {
    const sql = "SELECT * FROM pedidos WHERE idcliente = ? ORDER BY id DESC;";
    const values = [idcliente];
    const [rows] = await db.execute<Ipedido[]>(sql, values);
    return rows;
  }

  async create(dados: Omit<Ipedido, 'id'>): Promise<ResultSetHeader> {
    const sql = "INSERT INTO pedidos (idcliente, idvendedor, status, total) VALUES (?, ?, ?, ?);";
    const values = [dados.ClienteId, dados.VendedorId, dados.Status, dados.Total];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async update(id: number, dados: Omit<Ipedido, 'id'>): Promise<ResultSetHeader> {
    const sql = "UPDATE pedidos SET idcliente = ?, idvendedor = ?, status = ?, total = ? WHERE id = ?;";
    const values = [dados.ClienteId, dados.VendedorId, dados.Status, dados.Total, id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async delete(id: number): Promise<ResultSetHeader> {
    const sql = "DELETE FROM pedidos WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}
