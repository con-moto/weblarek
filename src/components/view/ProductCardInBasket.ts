import { Component } from '../base/Component';
import { IProduct } from '../../types';

export class ProductCardInBasket extends Component<IProduct> {
    private indexElement: HTMLElement;
    private titleElement: HTMLElement;
    private priceElement: HTMLElement;
    private deleteButton: HTMLButtonElement;
    private removeHandler: ((id: string) => void) | null = null;
    private id: string = '';

    constructor(container: HTMLElement) {
        super(container);
        this.indexElement = this.container.querySelector('.basket__item-index') as HTMLElement;
        this.titleElement = this.container.querySelector('.card__title') as HTMLElement;
        this.priceElement = this.container.querySelector('.card__price') as HTMLElement;
        this.deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;

        this.deleteButton.addEventListener('click', () => {
            if (this.removeHandler) {
                this.removeHandler(this.id);
            }
        });
    }

    public setProduct(product: IProduct, index: number): void {
        this.id = product.id;
        this.indexElement.textContent = String(index);
        this.titleElement.textContent = product.title;
        this.priceElement.textContent = `${product.price ?? 0} синапсов`;
    }

    public setRemoveHandler(handler: (id: string) => void): void {
        this.removeHandler = handler;
    }

    public renderItem(product: IProduct, index: number, handler: (id: string) => void): HTMLElement {
        this.setProduct(product, index);
        this.setRemoveHandler(handler);
        return this.container;
    }
}