export interface EnderecoSicVO {
  cepend?: string;
  logend?: string;
  numend?: string;
  baiend?: string;
  cidade?: string;
  uf?: string;
}

export class Endereco implements EnderecoSicVO {
  constructor(
    public cepend?: string,
    public logend?: string,
    public numend?: string,
    public baiend?: string,
    public cidade?: string,
    public uf?: string
  ) {}
}
