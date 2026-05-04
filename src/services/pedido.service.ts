import { Pedido } from "../models/pedido.model";
import { PedidoRepository } from "../repository/pedido.repository";

export class PedidoService {
  constructor(readonly _repository = new PedidoRepository()) {}

  async selecionarTodos() {
    return await this._repository.findAll();
  }
  async selecionarPorId(id: number) {
    return await this._repository.findById(id);
  }
  async selecionarPorCliente(idcliente: number) {
    return await this._repository.findByCliente(idcliente);
  }
  async criar(clienteId: number, vendedorId: number) {
    const pedido = Pedido.criar(clienteId, vendedorId);
    return await this._repository.create(pedido);
  }
  async editar(id: number, clienteId: number, vendedorId: number, status: string, total: number) {
    const pedido = Pedido.editar(id, clienteId, vendedorId, status, total);
    return await this._repository.update(id, pedido);
  }
  async deletar(id: number) {
    return await this._repository.delete(id);
  }
}
