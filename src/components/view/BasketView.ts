import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class BasketView extends Component<{
    items: HTMLElement[];
    total: number;
    disabled: boolean;
}> {
    private listElement: HTMLElement;
    private totalElement: HTMLElement;
    private orderButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        private readonly events: IEvents
    ) {
        super(container);

        this.listElement = this.container.querySelector(
            '.basket__list'
        ) as HTMLElement;

        this.totalElement = this.container.querySelector(
            '.basket__price'
        ) as HTMLElement;

        this.orderButton = this.container.querySelector(
            '.basket__button'
        ) as HTMLButtonElement;

        this.orderButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    public setItems(items: HTMLElement[]): void {
        this.listElement.replaceChildren(...items);
    }

    public setTotal(total: number): void {
        this.totalElement.textContent = `${total} синапсов`;
    }

    public setDisabled(disabled: boolean): void {
        this.orderButton.disabled = disabled;
    }

    public render(data: {
        items: HTMLElement[];
        total: number;
        disabled: boolean;
    }): HTMLElement {
        this.setItems(data.items);
        this.setTotal(data.total);
        this.setDisabled(data.disabled);

        return this.container;
    }
}