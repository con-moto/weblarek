import { Form } from './Form';
import { IBuyer, TPayment } from '../../types';

export class OrderForm extends Form<IBuyer> {
    private paymentButtons: HTMLButtonElement[];
    private addressInput: HTMLInputElement;
    private payment: TPayment | null = null;

    constructor(container: HTMLElement) {
        super(container);

        this.paymentButtons = Array.from(
            this.container.querySelectorAll('button[name]')
        ) as HTMLButtonElement[];

        this.addressInput = this.container.querySelector(
            'input[name="address"]'
        ) as HTMLInputElement;

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.setPayment(button.name as TPayment);
                this.clearErrors();
                this.updateButtonState();
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.clearErrors();
            this.updateButtonState();
        });

        this.updateButtonState();
    }

    private updateButtonState(): void {
        this.setDisabled(!this.isValid());
    }

    public setPayment(value: TPayment): void {
        this.payment = value;

        this.paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === value);
        });

        this.updateButtonState();
    }

    public setAddress(value: string): void {
        this.addressInput.value = value;
        this.updateButtonState();
    }

    public getData(): Pick<IBuyer, 'payment' | 'address'> {
        return {
            payment: this.payment,
            address: this.addressInput.value.trim(),
        };
    }

    public isValid(): boolean {
        return this.payment !== null && this.addressInput.value.trim().length > 0;
    }

    public render(): HTMLElement {
        return this.container;
    }
}