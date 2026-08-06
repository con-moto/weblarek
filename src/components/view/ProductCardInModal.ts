import { Card } from './Card';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

export class ProductCardInModal extends Card {
    private categoryElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private textElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    private clickHandler: (() => void) | null = null;

    constructor(container: HTMLElement) {
        super(container);

        this.categoryElement = this.container.querySelector(
            '.card__category'
        ) as HTMLElement;

        this.imageElement = this.container.querySelector(
            '.card__image'
        ) as HTMLImageElement;

        this.textElement = this.container.querySelector(
            '.card__text'
        ) as HTMLElement;

        this.buttonElement = this.container.querySelector(
            '.card__button'
        ) as HTMLButtonElement;

        this.buttonElement.addEventListener('click', () => {
            this.clickHandler?.();
        });
    }

    public setProduct(
        product: IProduct,
        inBasket = false
    ): void {
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

        this.textElement.textContent = product.description;

        if (product.price === null) {
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        } else {
            this.buttonElement.disabled = false;
            this.buttonElement.textContent = inBasket
                ? 'Удалить из корзины'
                : 'Купить';
        }
    }

    public setClickHandler(handler: () => void): void {
        this.clickHandler = handler;
    }
}