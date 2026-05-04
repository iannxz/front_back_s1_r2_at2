import { Cliente } from "../models/cliente.model";
import { ClienteRepository } from "../repository/cliente.repository";

export class ClienteService {
  constructor(readonly _repository = new ClienteRepository()) {}

  async selecionarTodos() {
    return await this._repository.findAll();
  }
  async selecionarPorId(id: number) {
    return await this._repository.findById(id);
  }
  async criar(nome: string, email: string, telefone: string, cpf: string, endereco: string) {
    const cliente = Cliente.criar(nome, email, telefone, cpf, endereco);
    return await this._repository.create(cliente);
  }
  async editar(id: number, nome: string, email: string, telefone: string, cpf: string, endereco: string, ativo: boolean) {
    const cliente = Cliente.editar(id, nome, email, telefone, cpf, endereco, ativo);
    return await this._repository.update(id, cliente);
  }
  async deletar(id: number) {
    return await this._repository.delete(id);
  }
}
