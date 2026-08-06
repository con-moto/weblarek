import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IFormSubmitEvent {
    formName: string;
}

export interface IFormInputEvent {
    formName: string;
    field: string;
    value: string;
}

export class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected readonly events: IEvents;
    protected readonly formName: string;

    constructor(
        container: HTMLElement,
        events: IEvents
    ) {
        super(container);

        this.events = events;
        this.formName = container.getAttribute('name') ?? '';

        this.submitButton = this.container.querySelector(
            'button[type="submit"]'
        ) as HTMLButtonElement;

        this.errorsElement = this.container.querySelector(
            '.form__errors'
        ) as HTMLElement;

        this.submitButton.disabled = false;

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();

            this.events.emit<IFormSubmitEvent>('form:submit', {
                formName: this.formName,
            });
        });
    }

    public setDisabled(disabled: boolean): void {
        this.submitButton.disabled = disabled;
    }

    public setErrors(message: string): void {
        this.errorsElement.textContent = message;
    }

    public clearErrors(): void {
        this.errorsElement.textContent = '';
    }
}