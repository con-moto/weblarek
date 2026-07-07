import { IBuyer, TPayment } from '../../types';

export class Buyer {
  private payment: TPayment = '';
  private address: string = '';
  private email: string = '';
  private phone: string = '';

  constructor() {}

  public setBuyerData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
  }

  public getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  public clearBuyerData(): void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  public validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (!this.address) {
      errors.address = 'Не указан адрес доставки';
    }

    if (!this.email) {
      errors.email = 'Не указана почта';
    }

    if (!this.phone) {
      errors.phone = 'Не указан телефон';
    }

    return errors;
  }
}