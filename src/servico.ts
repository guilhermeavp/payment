import { badData } from '@hapi/boom';
import { PaymentDto } from './command/payment-dto';
import { pagamentoExemplo } from './massa/pagamentoExemplo';

export class Servico {
  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async payment(dto: PaymentDto): Promise<string> {
    if (!dto.idCompany  || !dto.Idcart 
    ) {
      return Promise.reject(badData('idCompany e cartId devem ser preenchidos'));
    }
    if (dto.idCompany === pagamentoExemplo.id && 
    dto.Idcart === pagamentoExemplo.Idcart
    ) {
      await this.timeout(2000);
      return Promise.resolve('Pagamento realizado com sucesso');
    }
    return Promise.reject(badData('Dados informados para paramento não localizados. Revise os dados e tente novamente'));
  }
}
