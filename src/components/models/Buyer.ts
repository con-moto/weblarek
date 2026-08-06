import {
    IBuyer,
    TPayment,
    IBuyerValidationErrors,
} from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    private payment: TPayment | null = null;
    private address = '';
    private email = '';
    private phone = '';

    constructor(private readonly events: IEvents) {}

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

        this.events.emit('buyer:change');
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

        this.events.emit('buyer:change');
    }

    public validate(): IBuyerValidationErrors {
        const errors: IBuyerValidationErrors = {};

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const phonePattern =
            /^\+7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this.address.trim()) {
            errors.address = 'Не указан адрес доставки';
        }

        if (!this.email.trim()) {
            errors.email = 'Не указана почта';
        } else if (!emailPattern.test(this.email.trim())) {
            errors.email = 'Укажите корректный email';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Не указан телефон';
        } else if (!phonePattern.test(this.phone.trim())) {
            errors.phone =
                'Укажите телефон в формате +7 (900) 123-45-67';
        }

        return errors;
    }
}