import { db } from "../database/db.connection";
import { Ivendedor } from "../models/vendedor.model";
import { ResultSetHeader } from "mysql2";

export class VendedorRepository {
  async findAll(): Promise<Ivendedor[]> {
    const [rows] = await db.execute<Ivendedor[]>("SELECT * FROM vendedores ORDER BY nome;");
    return rows;
  }

  async findById(id: number): Promise<Ivendedor | null> {
    const sql = "SELECT * FROM vendedores WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<Ivendedor[]>(sql, values);
    return rows.length > 0 ? rows[0] : null;
  }

  async create(dados: Omit<Ivendedor, 'id'>): Promise<ResultSetHeader> {
    const sql = "INSERT INTO vendedores (nome, email, telefone, cpf, comissao) VALUES (?, ?, ?, ?, ?);";
    const values = [dados.Nome, dados.Email, dados.Telefone, dados.Cpf, dados.Comissao];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async update(id: number, dados: Omit<Ivendedor, 'id'>): Promise<ResultSetHeader> {
    const sql = "UPDATE vendedores SET nome = ?, email = ?, telefone = ?, cpf = ?, comissao = ?, ativo = ? WHERE id = ?;";
    const values = [dados.Nome, dados.Email, dados.Telefone, dados.Cpf, dados.Comissao, dados.Ativo, id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }

  async delete(id: number): Promise<ResultSetHeader> {
    const sql = "DELETE FROM vendedores WHERE id = ?;";
    const values = [id];
    const [rows] = await db.execute<ResultSetHeader>(sql, values);
    return rows;
  }
}
