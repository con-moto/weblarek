import { Card } from './Card';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class ProductCard extends Card {
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private clickHandler: (() => void) | null = null;

    constructor(container: HTMLElement) {
        super(container);

        this.categoryElement = this.container.querySelector(
            '.card__category'
        ) as HTMLElement;

        this.imageElement = this.container.querySelector(
            '.card__image'
        ) as HTMLImageElement;

        this.container.addEventListener('click', () => {
            this.clickHandler?.();
        });
    }

    public setProduct(product: IProduct): void {
        this.setTitle(product.title);
        this.setPrice(product.price);

        this.categoryElement.textContent = product.category;

        const modifier =
            categoryMap[product.category as keyof typeof categoryMap] ??
            categoryMap['другое'];

        this.categoryElement.className =
            `card__category ${modifier}`;

        this.imageElement.src = product.image;
        this.imageElement.alt = product.title;
    }

    public setClickHandler(handler: () => void): void {
        this.clickHandler = handler;
    }

    public renderCard(
        product: IProduct,
        handler: () => void
    ): HTMLElement {
        this.setProduct(product);
        this.setClickHandler(handler);

        return this.container;
    }
}