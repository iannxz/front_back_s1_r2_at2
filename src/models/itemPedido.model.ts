import { RowDataPacket } from "mysql2";

export interface IitemPedido extends RowDataPacket {
  id?: number;
  idpedido: number;
  idproduto: number;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export class ItemPedido {
  readonly _id?: number;
  private _pedidoId: number = 0;
  private _produtoId: number = 0;
  private _quantidade: number = 1;
  private _precoUnitario: number = 0;
  private _subtotal: number = 0;

  constructor(pedidoId: number, produtoId: number, quantidade: number, precoUnitario: number, id?: number) {
    this._pedidoId = pedidoId;
    this._produtoId = produtoId;
    this._quantidade = quantidade;
    this._precoUnitario = precoUnitario;
    this._subtotal = quantidade * precoUnitario; 
    this._id = id;
  }

  // Getters
  public get Id(): number | undefined {
    return this._id;
  }
  public get PedidoId(): number {
    return this._pedidoId;
  }
  public get ProdutoId(): number {
    return this._produtoId;
  }
  public get Quantidade(): number {
    return this._quantidade;
  }
  public get PrecoUnitario(): number {
    return this._precoUnitario;
  }
  public get Subtotal(): number {
    return this._subtotal;
  }

  // Setters
  public set Quantidade(value: number) {
    this._validarQuantidade(value);
    this._quantidade = value;
    this._subtotal = value * this._precoUnitario;
  }
  public set PrecoUnitario(value: number) {
    this._precoUnitario = value;
    this._subtotal = this._quantidade * value;
  }

  // desing pattern => Factory Method
  public static criar(pedidoId: number, produtoId: number, quantidade: number, precoUnitario: number): ItemPedido {
    return new ItemPedido(pedidoId, produtoId, quantidade, precoUnitario);
  }

  public static editar(id: number, pedidoId: number, produtoId: number, quantidade: number, precoUnitario: number): ItemPedido {
    return new ItemPedido(pedidoId, produtoId, quantidade, precoUnitario, id);
  }

  public static deletar(id: number): ItemPedido {
    const item = new ItemPedido(0, 0, 0, 0, id); 
    return item;
  }

  private _validarQuantidade(value: number): void {
    if (value <= 0) {
      throw new Error("Quantidade deve ser maior que zero");
    }
  }
}
