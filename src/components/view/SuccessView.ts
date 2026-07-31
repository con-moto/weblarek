import { Component } from '../base/Component';

export class SuccessView extends Component<number> {
    private descriptionElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this.descriptionElement = this.container.querySelector('.order-success__description') as HTMLElement;
        this.closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;
    }

    public setTotal(total: number): void {
        this.descriptionElement.textContent = `Списано ${total} синапсов`;
    }

    public setCloseHandler(handler: () => void): void {
        this.closeButton.addEventListener('click', handler, { once: true });
    }

    public render(total: number): HTMLElement {
        this.setTotal(total);
        return this.container;
    }
}