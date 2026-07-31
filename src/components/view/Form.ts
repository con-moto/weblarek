import { Component } from '../base/Component';

export class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorsElement = this.container.querySelector('.form__errors') as HTMLElement;
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

    public render(): HTMLElement {
        return this.container;
    }
}