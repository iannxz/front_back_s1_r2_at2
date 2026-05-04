import { RowDataPacket } from "mysql2";
import { Pessoa } from "./pessoa.model";

export interface Icliente extends RowDataPacket {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  ativo?: boolean;
  dataCad?: Date;
}

export class Cliente extends Pessoa {
  private _endereco: string = "";

  constructor(nome: string, email: string, telefone: string, cpf: string, endereco: string, ativo?: boolean, id?: number) {
    super(nome, email, telefone, cpf, ativo, id); // chama o construtor da classe pai
    this._endereco = endereco;
  }

  // Getter e setter 
  public get Endereco(): string {
    return this._endereco;
  }
  public set Endereco(value: string) {
    this._endereco = value;
  }

  // polimorfismo - sobrescrita do metodo abstrato da classe Pessoa
  public exibirInfo(): string {
    return `Cliente: ${this.Nome} - CPF: ${this.Cpf} - Endereço: ${this._endereco}`;
  }

  // desing pattern Factory Method
  public static criar(nome: string, email: string, telefone: string, cpf: string, endereco: string): Cliente {
    return new Cliente(nome, email, telefone, cpf, endereco);
  }

  public static editar(id: number, nome: string, email: string, telefone: string, cpf: string, endereco: string, ativo: boolean): Cliente {
    return new Cliente(nome, email, telefone, cpf, endereco, ativo, id);
  }

  public static deletar(id: number): Cliente {
    const cliente = new Cliente("N/A", "n/a@n.com", "", "", "", true, id); 
    return cliente;
  }
}
