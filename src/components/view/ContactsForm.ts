import { Form } from './Form';
import { IBuyer } from '../../types';

export class ContactsForm extends Form<IBuyer> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLElement) {
        super(container);

        this.emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        this.phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;

        this.emailInput.addEventListener('input', () => {
            this.clearErrors();
            this.updateButtonState();
        });

        this.phoneInput.addEventListener('input', () => {
            this.clearErrors();
            this.updateButtonState();
        });

        this.updateButtonState();
    }

    private updateButtonState(): void {
        this.setDisabled(!this.isValid());
    }

    public setEmail(value: string): void {
        this.emailInput.value = value;
        this.updateButtonState();
    }

    public setPhone(value: string): void {
        this.phoneInput.value = value;
        this.updateButtonState();
    }

    public getData(): Pick<IBuyer, 'email' | 'phone'> {
        return {
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim(),
        };
    }

    public isValid(): boolean {
        return this.emailInput.value.trim().length > 0 && this.phoneInput.value.trim().length > 0;
    }

    public render(): HTMLElement {
        return this.container;
    }
}