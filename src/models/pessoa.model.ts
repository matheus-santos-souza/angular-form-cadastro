export interface PessoaSicVO {
  id_pes?: number | null;
  id_tip_ins?: number | null;
  tipo_pessoa?: string | null;
  razao_social?: string | null;
  nome?: string | null;
  cpf_cnpj?: string | null;
  profissao?: string | null;
  logradouro?: string | null;
  numero?: number | null;
  cep?: string | null;
  bairro?: string | null;
  fone_fixo?: string | null;
  fone_celular?: string | null;
  sexo?: string | null;
  email?: string | null;
  escolaridade?: string | null;
  cidade?: string | null;
  uf?: string | null;
  senha?: string | null;
}

export class Pessoa implements PessoaSicVO {
  constructor(
    public id_pes?: number | null,
    public id_tip_ins?: number | null,
    public tipo_pessoa?: string | null,
    public razao_social?: string | null,
    public nome?: string | null,
    public cpf_cnpj?: string | null,
    public profissao?: string | null,
    public logradouro?: string | null,
    public numero?: number | null,
    public cep?: string | null,
    public bairro?: string | null,
    public fone_fixo?: string | null,
    public fone_celular?: string | null,
    public sexo?: string | null,
    public email?: string | null,
    public escolaridade?: string | null,
    public cidade?: string | null,
    public uf?: string | null,
    public senha?: string | null
  ) {}
}
