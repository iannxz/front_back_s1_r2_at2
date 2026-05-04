import { RowDataPacket } from "mysql2";
import { Pessoa } from "./pessoa.model";

export interface Ivendedor extends RowDataPacket {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  comissao: number;
  ativo?: boolean;
  dataCad?: Date;
}

export class Vendedor extends Pessoa {
  private _comissao: number = 0;

  constructor(nome: string, email: string, telefone: string, cpf: string, comissao: number, ativo?: boolean, id?: number) {
    super(nome, email, telefone, cpf, ativo, id);
    this._comissao = comissao;
  }

  // Getter e setter da comissao
  public get Comissao(): number {
    return this._comissao;
  }
  public set Comissao(value: number) {
    this._validarComissao(value);
    this._comissao = value;
  }

  // polimorfismo - sobrescrita do metodo da classe pai
  public exibirInfo(): string {
    return `Vendedor: ${this.Nome} - CPF: ${this.Cpf} - Comissão: ${this._comissao}%`;
  }

  // desing pattern => Factory Method
  public static criar(nome: string, email: string, telefone: string, cpf: string, comissao: number): Vendedor {
    return new Vendedor(nome, email, telefone, cpf, comissao);
  }

  public static editar(id: number, nome: string, email: string, telefone: string, cpf: string, comissao: number, ativo: boolean): Vendedor {
    return new Vendedor(nome, email, telefone, cpf, comissao, ativo, id);
  }

  public static deletar(id: number): Vendedor {
    const vendedor = new Vendedor("N/A", "n/a@n.com", "", "", 0, true, id); 
    return vendedor;
  }

  private _validarComissao(value: number): void {
    if (value < 0 || value > 100) {
      throw new Error("Comissão deve ser entre 0 e 100");
    }
  }
}
