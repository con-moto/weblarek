import { Component } from '../base/Component';
import { IProduct } from '../../types';

export class Card extends Component<IProduct> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = this.container.querySelector(
            '.card__title'
        ) as HTMLElement;

        this.priceElement = this.container.querySelector(
            '.card__price'
        ) as HTMLElement;
    }

    protected setTitle(title: string): void {
        this.titleElement.textContent = title;
    }

    protected setPrice(price: number | null): void {
        this.priceElement.textContent =
            price === null ? 'Бесценно' : `${price} синапсов`;
    }
}