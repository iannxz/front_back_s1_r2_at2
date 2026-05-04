// Classe abstrata Pessoa - é a base para criação Cliente e Vendedor

export abstract class Pessoa {
  readonly _id?: number;
  private _nome: string = "";
  private _email: string = "";
  private _telefone: string = "";
  private _cpf: string = "";
  readonly _ativo: boolean;

  constructor(nome: string, email: string, telefone: string, cpf: string, ativo?: boolean, id?: number) {
    this._nome = nome;
    this._email = email;
    this._telefone = telefone;
    this._cpf = cpf;
    this._ativo = ativo ?? true;
    this._id = id;
  }

  // Getters
  public get Id(): number | undefined {
    return this._id;
  }
  public get Nome(): string {
    return this._nome;
  }
  public get Email(): string {
    return this._email;
  }
  public get Telefone(): string {
    return this._telefone;
  }
  public get Cpf(): string {
    return this._cpf;
  }
  public get Ativo(): boolean {
    return this._ativo;
  }

  // Setters
  public set Nome(value: string) {
    this._validarNome(value);
    this._nome = value;
  }
  public set Email(value: string) {
    this._validarEmail(value);
    this._email = value;
  }
  public set Telefone(value: string) {
    this._telefone = value;
  }
  public set Cpf(value: string) {
    this._cpf = value;
  }

  // metodo abstrato - cada subclasse implementa do seu jeito (polimorfismo)
  abstract exibirInfo(): string;

  // validações em comum
  protected _validarNome(value: string): void {
    if (!value || value.trim().length < 3) {
      throw new Error("Nome deve ter pelo menos 3 caracteres");
    }
  }
  protected _validarEmail(value: string): void {
    if (!value || !value.includes("@")) {
      throw new Error("Email inválido");
    }
  }
}
