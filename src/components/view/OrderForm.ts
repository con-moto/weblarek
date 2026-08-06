import { Form, IFormInputEvent } from './Form';
import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class OrderForm extends Form<IBuyer> {
    private paymentButtons: HTMLButtonElement[];
    private addressInput: HTMLInputElement;

    constructor(
        container: HTMLElement,
        events: IEvents
    ) {
        super(container, events);

        this.paymentButtons = Array.from(
            this.container.querySelectorAll('button[name]')
        ) as HTMLButtonElement[];

        this.addressInput = this.container.querySelector(
            'input[name="address"]'
        ) as HTMLInputElement;

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;

                this.setPayment(payment);
                this.clearErrors();

                this.events.emit<IFormInputEvent>('form:input', {
                    formName: this.formName,
                    field: 'payment',
                    value: payment,
                });
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.clearErrors();

            this.events.emit<IFormInputEvent>('form:input', {
                formName: this.formName,
                field: 'address',
                value: this.addressInput.value.trim(),
            });
        });
    }

    public setPayment(value: TPayment): void {
        this.paymentButtons.forEach((button) => {
            button.classList.toggle(
                'button_alt-active',
                button.name === value
            );
        });
    }

    public setAddress(value: string): void {
        this.addressInput.value = value;
    }
}