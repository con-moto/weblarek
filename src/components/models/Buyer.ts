import { IBuyer, TPayment, IBuyerValidationErrors } from '../../types';
import { EventEmitter } from '../base/Events';

export class Buyer extends EventEmitter {
    private payment: TPayment | null = null;
    private address: string = '';
    private email: string = '';
    private phone: string = '';

    constructor() {
        super();
    }

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

        this.emit('buyer:change');
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
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';

        this.emit('buyer:change');
    }

    public validate(): IBuyerValidationErrors {
        const errors: IBuyerValidationErrors = {};

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