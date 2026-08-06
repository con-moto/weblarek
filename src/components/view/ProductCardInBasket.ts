import { Card } from './Card';
import { IProduct } from '../../types';

export class ProductCardInBasket extends Card {
    private indexElement: HTMLElement;
    private deleteButton: HTMLButtonElement;
    private removeHandler: (() => void) | null = null;

    constructor(container: HTMLElement) {
        super(container);

        this.indexElement = this.container.querySelector(
            '.basket__item-index'
        ) as HTMLElement;

        this.deleteButton = this.container.querySelector(
            '.basket__item-delete'
        ) as HTMLButtonElement;

        this.deleteButton.addEventListener('click', () => {
            this.removeHandler?.();
        });
    }

    public setProduct(
        product: IProduct,
        index: number
    ): void {
        this.setTitle(product.title);
        this.setPrice(product.price);
        this.indexElement.textContent = String(index);
    }

    public setRemoveHandler(handler: () => void): void {
        this.removeHandler = handler;
    }

    public renderItem(
        product: IProduct,
        index: number,
        handler: () => void
    ): HTMLElement {
        this.setProduct(product, index);
        this.setRemoveHandler(handler);

        return this.container;
    }
}