import { Form, IFormInputEvent } from './Form';
import { IBuyer } from '../../types';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form<IBuyer> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(
        container: HTMLElement,
        events: IEvents
    ) {
        super(container, events);

        this.emailInput = this.container.querySelector(
            'input[name="email"]'
        ) as HTMLInputElement;

        this.phoneInput = this.container.querySelector(
            'input[name="phone"]'
        ) as HTMLInputElement;

        this.emailInput.addEventListener('input', () => {
            this.clearErrors();

            this.events.emit<IFormInputEvent>('form:input', {
                formName: this.formName,
                field: 'email',
                value: this.emailInput.value.trim(),
            });
        });

        this.phoneInput.addEventListener('input', () => {
            this.clearErrors();

            this.events.emit<IFormInputEvent>('form:input', {
                formName: this.formName,
                field: 'phone',
                value: this.phoneInput.value.trim(),
            });
        });
    }

    public setEmail(value: string): void {
        this.emailInput.value = value;
    }

    public setPhone(value: string): void {
        this.phoneInput.value = value;
    }
}