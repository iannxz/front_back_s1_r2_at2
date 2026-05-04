import { ItemPedido } from "../models/itemPedido.model";
import { ItemPedidoRepository } from "../repository/itemPedido.repository";

export class ItemPedidoService {
  constructor(readonly _repository = new ItemPedidoRepository()) {}

  async selecionarPorPedido(idpedido: number) {
    return await this._repository.findByPedido(idpedido);
  }
  async selecionarPorId(id: number) {
    return await this._repository.findById(id);
  }
  async criar(pedidoId: number, produtoId: number, quantidade: number, precoUnitario: number) {
    const item = ItemPedido.criar(pedidoId, produtoId, quantidade, precoUnitario);
    return await this._repository.create(item);
  }
  async editar(id: number, pedidoId: number, produtoId: number, quantidade: number, precoUnitario: number) {
    const item = ItemPedido.editar(id, pedidoId, produtoId, quantidade, precoUnitario);
    return await this._repository.update(id, item);
  }
  async deletar(id: number) {
    return await this._repository.delete(id);
  }
}
