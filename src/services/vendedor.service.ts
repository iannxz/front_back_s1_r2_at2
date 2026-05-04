import { Vendedor } from "../models/vendedor.model";
import { VendedorRepository } from "../repository/vendedor.repository";

export class VendedorService {
  constructor(readonly _repository = new VendedorRepository()) {}

  async selecionarTodos() {
    return await this._repository.findAll();
  }
  async selecionarPorId(id: number) {
    return await this._repository.findById(id);
  }
  async criar(nome: string, email: string, telefone: string, cpf: string, comissao: number) {
    const vendedor = Vendedor.criar(nome, email, telefone, cpf, comissao);
    return await this._repository.create(vendedor);
  }
  async editar(id: number, nome: string, email: string, telefone: string, cpf: string, comissao: number, ativo: boolean) {
    const vendedor = Vendedor.editar(id, nome, email, telefone, cpf, comissao, ativo);
    return await this._repository.update(id, vendedor);
  }
  async deletar(id: number) {
    return await this._repository.delete(id);
  }
}
