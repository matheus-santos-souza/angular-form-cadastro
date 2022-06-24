import { FormControl, FormGroup } from '@angular/forms';
import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator';
import { Endereco } from 'src/models/endereco.model';

export class CadastroValidation {
  static getRegexEmail() {
    return new RegExp(
      '^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$'
    );
  }

  static validaCPFCNPJ(control: FormControl): any {
    const cpfcnpj = control?.value;
    if (cpfcnpj && cpfcnpj !== '') {
      return cpfValidator.isValid(cpfcnpj) || cnpjValidator.isValid(cpfcnpj)
        ? ''
        : { cpfcnpjInvalid: true };
    }
    return '';
  }

  static validaNome(control: FormControl): any {
    const nome = control?.value;
    const arrayNome = nome?.split(' ');
    return arrayNome && arrayNome[0]?.length > 2 && arrayNome[1]
      ? ''
      : { nomeError: true };
  }

  static equalsPassword = (password: string): any => {
    const validator = (confirmaPassword: FormControl) => {
      if (password == null) {
        throw new Error('É necessário informar um campo.');
      }
      if (
        !confirmaPassword.root ||
        !(<FormGroup>confirmaPassword.root).controls
      ) {
        return '';
      }
      const passwordControl = (<FormGroup>confirmaPassword.root).get(password);
      if (!passwordControl) {
        throw new Error('É necessário informar um campo válido.');
      }

      return passwordControl?.value === confirmaPassword?.value
        ? ''
        : { equalsPassword: password };
    };
    return validator;
  };
}
