import { RowDataPacket } from "mysql2";

export interface Ipedido extends RowDataPacket {
  id?: number;
  idcliente: number;
  idvendedor: number;
  dataPedido?: Date;
  status: string;
  total: number;
  ativo?: boolean;
}

export class Pedido {
  readonly _id?: number;
  private _clienteId: number = 0;
  private _vendedorId: number = 0;
  private _status: string = "pendente";
  private _total: number = 0;
  readonly _ativo: boolean;

  constructor(clienteId: number, vendedorId: number, status?: string, total?: number, ativo?: boolean, id?: number) {
    this._clienteId = clienteId;
    this._vendedorId = vendedorId;
    this._status = status ?? "pendente";
    this._total = total ?? 0;
    this._ativo = ativo ?? true;
    this._id = id;
  }

  // Getters
  public get Id(): number | undefined {
    return this._id;
  }
  public get ClienteId(): number {
    return this._clienteId;
  }
  public get VendedorId(): number {
    return this._vendedorId;
  }
  public get Status(): string {
    return this._status;
  }
  public get Total(): number {
    return this._total;
  }
  public get Ativo(): boolean {
    return this._ativo;
  }

  // Setters
  public set ClienteId(value: number) {
    this._clienteId = value;
  }
  public set VendedorId(value: number) {
    this._vendedorId = value;
  }
  public set Status(value: string) {
    this._status = value;
  }
  public set Total(value: number) {
    this._total = value;
  }

  // desing pattern => Factory Method
  public static criar(clienteId: number, vendedorId: number): Pedido {
    return new Pedido(clienteId, vendedorId);
  }

  public static editar(id: number, clienteId: number, vendedorId: number, status: string, total: number): Pedido {
    return new Pedido(clienteId, vendedorId, status, total, true, id);
  }

  public static deletar(id: number): Pedido {
    const pedido = new Pedido(0, 0, "cancelado", 0, true, id); 
    return pedido;
  }
}
