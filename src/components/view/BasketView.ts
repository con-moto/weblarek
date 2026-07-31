import { Component } from '../base/Component';

export class BasketView extends Component<{ items: HTMLElement[]; total: number; disabled: boolean }> {
    private listElement: HTMLElement;
    private totalElement: HTMLElement;
    private orderButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this.listElement = this.container.querySelector('.basket__list') as HTMLElement;
        this.totalElement = this.container.querySelector('.basket__price') as HTMLElement;
        this.orderButton = this.container.querySelector('.basket__button') as HTMLButtonElement;
    }

    public setItems(items: HTMLElement[]): void {
        if (items.length === 0) {
            this.listElement.replaceChildren();
            this.listElement.textContent = 'Корзина пуста';
        } else {
            this.listElement.replaceChildren(...items);
        }
    }

    public setTotal(total: number): void {
        this.totalElement.textContent = `${total} синапсов`;
    }

    public setDisabled(disabled: boolean): void {
        this.orderButton.disabled = disabled;
    }

    public setOrderHandler(handler: () => void): void {
        this.orderButton.onclick = () => {
            handler();
        };
    }

    public render(data: { items: HTMLElement[]; total: number; disabled: boolean }): HTMLElement {
        this.setItems(data.items);
        this.setTotal(data.total);
        this.setDisabled(data.disabled);
        return this.container;
    }
}