import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class SuccessView extends Component<number> {
    private descriptionElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        private readonly events: IEvents
    ) {
        super(container);

        this.descriptionElement = this.container.querySelector(
            '.order-success__description'
        ) as HTMLElement;

        this.closeButton = this.container.querySelector(
            '.order-success__close'
        ) as HTMLButtonElement;

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    public setTotal(total: number): void {
        this.descriptionElement.textContent =
            `Списано ${total} синапсов`;
    }

    public render(total: number): HTMLElement {
        this.setTotal(total);

        return this.container;
    }
}