import { db } from "../database/db.connection";
import { Icliente } from "../models/cliente.model";
import { ResultSetHeader } from "mysql2";

export class ClienteRepository {
  async findAll(): Promise<Icliente[]> {
    const [rows] = await db.execute<Icliente[]>("SELECT * FROM clientes ORDER BY nome;");
    return rows;
  }

  async findById(id: number): Promise<Icliente | null> {
    const sql = "SELECT * FROM clientes WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<Icliente[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
  }

  async create(dados: Omit<Icliente, 'id'>): Promise<ResultSetHeader> {
    const sql = "INSERT INTO clientes (nome, email, telefone, cpf, endereco) VALUES (?, ?, ?, ?, ?);";
    const values = [dados.Nome, dados.Email, dados.Telefone, dados.Cpf, dados.Endereco];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async update(id: number, dados: Omit<Icliente, 'id'>): Promise<ResultSetHeader> {
    const sql = "UPDATE clientes SET nome = ?, email = ?, telefone = ?, cpf = ?, endereco = ?, ativo = ? WHERE id = ?;";
    const values = [dados.Nome, dados.Email, dados.Telefone, dados.Cpf, dados.Endereco, dados.Ativo, id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async delete(id: number): Promise<ResultSetHeader> {
    const sql = "DELETE FROM clientes WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}
