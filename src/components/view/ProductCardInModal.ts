import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class ProductCardInModal extends Component<IProduct> {
    private id: string = '';
    private categoryElement: HTMLElement;
    private titleElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private textElement: HTMLElement;
    private priceElement: HTMLElement;
    private buttonElement: HTMLButtonElement;
    private clickHandler: ((id: string) => void) | null = null;

    constructor(container: HTMLElement) {
        super(container);
        this.categoryElement = this.container.querySelector('.card__category') as HTMLElement;
        this.titleElement = this.container.querySelector('.card__title') as HTMLElement;
        this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
        this.textElement = this.container.querySelector('.card__text') as HTMLElement;
        this.priceElement = this.container.querySelector('.card__price') as HTMLElement;
        this.buttonElement = this.container.querySelector('.card__button') as HTMLButtonElement;

        this.buttonElement.addEventListener('click', () => {
            if (this.clickHandler) {
                this.clickHandler(this.id);
            }
        });
    }

    public setProduct(product: IProduct, inBasket: boolean = false): void {
        this.id = product.id;
        this.titleElement.textContent = product.title;
        this.categoryElement.textContent = product.category;

        const modifier = categoryMap[product.category as keyof typeof categoryMap] ?? categoryMap['другое'];
        this.categoryElement.className = `card__category ${modifier}`;

        this.imageElement.src = `${CDN_URL}${product.image}`;
        this.imageElement.alt = product.title;
        this.textElement.textContent = product.description;

        if (product.price === null) {
            this.priceElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
            this.buttonElement.textContent = 'Недоступно';
        } else {
            this.priceElement.textContent = `${product.price} синапсов`;
            this.buttonElement.disabled = false;
            this.buttonElement.textContent = inBasket ? 'Удалить из корзины' : 'Купить';
        }
    }

    public setClickHandler(handler: (id: string) => void): void {
        this.clickHandler = handler;
    }

    public renderCard(product: IProduct, handler: (id: string) => void, inBasket: boolean = false): HTMLElement {
        this.setProduct(product, inBasket);
        this.setClickHandler(handler);
        return this.container;
    }
}