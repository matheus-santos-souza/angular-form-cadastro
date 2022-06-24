import { Component, DoCheck, Injectable, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CadastroValidation } from 'src/form.validation/cadastro.validation';
import { Endereco } from 'src/models/endereco.model';
import { Pessoa, PessoaSicVO } from 'src/models/pessoa.model';
import { CadastroService } from 'src/services/cadastro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, DoCheck {
  formCadastro!: FormGroup;
  tipoPessoa?: string = '';
  endereco: Endereco | null | undefined;
  cepControleReq?: string | null;
  pessoa?: PessoaSicVO | null;

  IS_VALID: string = 'is-valid';
  IS_INVALID: string = 'is-invalid';
  numForca: number = 0;
  isProgress: boolean = false;
  tamanhoProgress: number = 0;
  mensagemProgress: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private cadastroService: CadastroService,
    private snackBar: MatSnackBar
  ) {
    this.formCadastro = this.formBuilder.group({
      tipopessoa: ['', Validators.required],
      cpfcnpj: ['', [Validators.required, CadastroValidation.validaCPFCNPJ]],
      nome: [
        '',
        [
          Validators.required,
          CadastroValidation.validaNome,
          Validators.pattern('^[-a-zA-ZÀ-ú ]*'),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(CadastroValidation.getRegexEmail()),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmapassword: [
        '',
        [Validators.required, CadastroValidation.equalsPassword('password')],
      ],
      cep: ['', Validators.required],
      numero: ['', Validators.required],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
      celular: [''],
      fixo: [''],

      //CAMPO CPF
      sexo: ['', Validators.required],
      escolaridade: ['', Validators.required],

      //CAMPOS CNPJ
      razaosocial: ['', Validators.required],
      cargo: [''],
      tipoinstituicao: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.disableInputs();
  }

  ngDoCheck(): void {
    this.controleDeObrigatorios();
  }

  async cadastrarPessoa(): Promise<void> {
    this.formCadastro.markAllAsTouched();
    if (this.formCadastro?.valid) {
      this.preencherPessoaSicVO();
      if (this.pessoa) {
        await this.cadastroService
          .setApiCadastroPessoa(this.pessoa)
          .toPromise()
          .then(
            data => {
              if (data?.status === 200) {
                this.snackBar.open('Cadastro realizado com sucesso!', 'OK', {
                  duration: 8000,
                });
              }
            },
            error => {
              this.snackBar.open('Erro ao realizar cadastro!', 'OK', {
                duration: 8000,
              });
            }
          );
      }
    } else {
      this.snackBar.open(
        `Verifique os erros nos campos para concluir seu cadastro!`,
        'OK',
        { duration: 6000 }
      );
    }
  }

  preencherPessoaSicVO(): void {
    this.pessoa = new Pessoa();
    this.pessoa.id_pes = null;
    this.pessoa.tipo_pessoa = this.formCadastro.get('tipopessoa')?.value;
    this.pessoa.cpf_cnpj = this.formCadastro.get('cpfcnpj')?.value;
    this.pessoa.email = this.formCadastro.get('email')?.value;
    this.pessoa.nome = this.formCadastro.get('nome')?.value;
    this.pessoa.senha = this.formCadastro.get('password')?.value;
    this.pessoa.cep = this.formCadastro.get('cep')?.value;
    this.pessoa.logradouro = this.formCadastro.get('logradouro')?.value;
    this.pessoa.numero = this.formCadastro.get('numero')?.value;
    this.pessoa.bairro = this.formCadastro.get('bairro')?.value;
    this.pessoa.cidade = this.formCadastro.get('cidade')?.value;
    this.pessoa.uf = this.formCadastro.get('uf')?.value;
    this.pessoa.fone_celular = this.formCadastro.get('celular')?.value || null;
    this.pessoa.fone_fixo = this.formCadastro.get('fixo')?.value || null;

    //Campos especificos CPF/CNPJ
    this.pessoa.sexo = this.formCadastro.get('sexo')?.value || null;
    this.pessoa.escolaridade =
      this.formCadastro.get('escolaridade')?.value || null;
    this.pessoa.razao_social =
      this.formCadastro.get('razaosocial')?.value || null;
    this.pessoa.id_tip_ins =
      this.formCadastro.get('tipoinstituicao')?.value || 0;
    this.pessoa.profissao = this.formCadastro.get('cargo')?.value || null;
  }

  controleDeObrigatorios(): void {
    if (this.tipoPessoa === 'F') {
      this.formCadastro.get('razaosocial')?.clearValidators();
      this.formCadastro.get('tipoinstituicao')?.clearValidators();
      this.formCadastro.get('sexo')?.setValidators([Validators.required]);
      this.formCadastro
        .get('escolaridade')
        ?.setValidators([Validators.required]);
    } else if (this.tipoPessoa === 'J') {
      this.formCadastro.get('sexo')?.clearValidators();
      this.formCadastro.get('escolaridade')?.clearValidators();
      this.formCadastro
        .get('razaosocial')
        ?.setValidators([Validators.required]);
      this.formCadastro
        .get('tipoinstituicao')
        ?.setValidators([Validators.required]);
    }
    this.formCadastro.get('razaosocial')?.updateValueAndValidity();
    this.formCadastro.get('tipoinstituicao')?.updateValueAndValidity();
    this.formCadastro.get('sexo')?.updateValueAndValidity();
    this.formCadastro.get('escolaridade')?.updateValueAndValidity();
  }

  control(control: AbstractControl | null): string {
    if (control?.dirty || control?.touched) {
      return control?.errors ? this.IS_INVALID : this.IS_VALID;
    }
    return '';
  }

  async existeCPFCNPJ(): Promise<void> {
    const control = this.formCadastro.get('cpfcnpj');
    await this.cadastroService
      .getApiVerificaCPFCNPJ(control?.value)
      .toPromise()
      .then()
      .catch(error => {
        control?.setErrors({
          cpfcnpjError: true,
        });
      });
  }

  async existeEmail(): Promise<void> {
    const control = this.formCadastro.get('email');
    await this.cadastroService
      .getApiVerificaEmail(control?.value)
      .toPromise()
      .then()
      .catch(error => {
        control?.setErrors({
          errorEmail: true,
        });
      });
  }

  getEndereco(): void {
    const control = this.formCadastro.get('cep');
    if (this.cepControleReq !== control?.value) {
      this.cepControleReq = control?.value;
      this.cadastroService
        .getApiEndereco(control?.value)
        .toPromise()
        .then(data => {
          if (data?.body) {
            this.preencherEndereco(data.body);
          } else {
            this.limparEndereco();
            control?.setErrors({ cepError: true });
          }
        });
    }
  }

  preencherEndereco(body: Endereco): void {
    this.endereco = body;
    this.formCadastro.get('logradouro')?.setValue(body?.logend);
    this.formCadastro.get('bairro')?.setValue(body?.baiend);
    this.formCadastro.get('cidade')?.setValue(body?.cidade);
    this.formCadastro.get('uf')?.setValue(body?.uf);
  }

  limparEndereco(): void {
    this.cepControleReq = null;
    this.endereco = null;
    this.formCadastro.get('logradouro')?.setValue('');
    this.formCadastro.get('bairro')?.setValue('');
    this.formCadastro.get('cidade')?.setValue('');
    this.formCadastro.get('uf')?.setValue('');
  }

  selecionaTipoPessoa(): void {
    this.tipoPessoa = this.formCadastro.get('tipopessoa')?.value;
    this.formCadastro.get('cpfcnpj')?.setValue('');
    this.formCadastro.get('sexo')?.setValue('');
    this.formCadastro.get('escolaridade')?.setValue('');
    this.formCadastro.get('razaosocial')?.setValue('');
    this.formCadastro.get('cargo')?.setValue('');
    this.formCadastro.get('tipoinstituicao')?.setValue('');
  }

  disableInputs(): void {
    this.formCadastro.get('logradouro')?.disable();
    this.formCadastro.get('bairro')?.disable();
    this.formCadastro.get('cidade')?.disable();
    this.formCadastro.get('uf')?.disable();
  }

  mostrarEsconderPassword(target: EventTarget | null): void {
    const idInput = (<HTMLInputElement>target).id;
    const inputPassword = document.querySelector('#password');
    const inputNewPassword = document.querySelector('#newPassword');
    const olhoPassword = document.querySelector('#olhoPassword');
    const olhoNewPassword = document.querySelector('#olhoNewPassword');
    if (idInput === 'olhoPassword') {
      this.trocaIconOlhoPassword(inputPassword, olhoPassword);
    } else if (idInput === 'olhoNewPassword') {
      this.trocaIconOlhoPassword(inputNewPassword, olhoNewPassword);
    }
  }

  trocaIconOlhoPassword(input: Element | null, iconOlho: Element | null): void {
    if (input?.getAttribute('type') === 'password') {
      input?.setAttribute('type', 'text');
      iconOlho?.classList.remove('bi-eye-fill');
      iconOlho?.classList.add('bi-eye-slash-fill');
    } else {
      input?.setAttribute('type', 'password');
      iconOlho?.classList.remove('bi-eye-slash-fill');
      iconOlho?.classList.add('bi-eye-fill');
    }
  }

  calculaForca(): string {
    const control = this.formCadastro.get('password');
    this.numForca = 0;
    if (control?.value?.length > 0) {
      const arrayForcas = [
        control?.value.match(/[0-9]/),
        control?.value.match(/[a-z]/),
        control?.value.match(/[A-Z]/),
        control?.value.match(/^(?=.*[À-Úà-ú@!#$%^&*()/\\])/),
      ];
      arrayForcas.map(forca => {
        if (forca != null) {
          this.numForca += 1;
        }
      });

      this.barraDeProgressoForcaPassword();
    }
    return this.control(control);
  }

  barraDeProgressoForcaPassword(): string {
    this.isProgress = true;
    if (this.numForca === 0) {
      this.tamanhoProgress = 0;
      this.isProgress = false;
      this.mensagemProgress = '';
      return '';
    } else if (this.numForca === 1) {
      this.tamanhoProgress = 20;
      this.mensagemProgress = 'Fraca';
      return 'progress-bar bg-danger';
    } else if (this.numForca === 2) {
      this.tamanhoProgress = 40;
      this.mensagemProgress = 'Média';
      return 'progress-bar bg-warning';
    } else if (this.numForca === 3) {
      this.tamanhoProgress = 60;
      this.mensagemProgress = 'Boa';
      return 'progress-bar bg-info';
    } else if (this.numForca === 4) {
      this.tamanhoProgress = 100;
      this.mensagemProgress = 'Excelente';
      return 'progress-bar bg-success';
    }
    return '';
  }

  clean(): void {
    this.formCadastro.reset('');
    this.formCadastro.get('tipopessoa')?.setValue('');
    this.formCadastro.get('sexo')?.setValue('');
    this.formCadastro.get('escolaridade')?.setValue('');
    this.formCadastro.get('tipoinstituicao')?.setValue('');
    this.isProgress = false;
    this.tipoPessoa = '';
  }
}

