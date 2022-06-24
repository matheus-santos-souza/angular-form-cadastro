import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  endereco,
  verificaCpfCnpj,
  cadastrarPessoa,
  verificaEmail
} from 'src/app/app.constants';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnderecoSicVO } from 'src/models/endereco.model';
import { PessoaSicVO } from 'src/models/pessoa.model';


@Injectable({
  providedIn: 'root',
})
export class CadastroService {
  constructor(private http: HttpClient) {}

  getApiEndereco(cep: string): Observable<HttpResponse<EnderecoSicVO>> {
    return this.http.get<EnderecoSicVO>(
      environment.urlApi + endereco + '?cep=' + cep,
      { observe: 'response' }
    );
  }

  getApiVerificaEmail(email: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(
      environment.urlApi + verificaEmail + '?email=' + email,
      { observe: 'response' }
    );
  }

  getApiVerificaCPFCNPJ(cpfcnpj: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(
      environment.urlApi + verificaCpfCnpj + '?cpfcnpj=' + cpfcnpj,
      { observe: 'response' }
    );
  }

  setApiCadastroPessoa(
    pessoa: PessoaSicVO
  ): Observable<HttpResponse<PessoaSicVO>> {
    return this.http.post<PessoaSicVO>(
      environment.urlApi + cadastrarPessoa,
      pessoa,
      {
        observe: 'response',
      }
    );
  }
}
