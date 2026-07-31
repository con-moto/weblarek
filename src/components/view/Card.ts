import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class Card extends Component<IProduct> {
    private id: string = '';

    private titleElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private categoryElement: HTMLElement;
    private priceElement: HTMLElement;
    private buttonElement: HTMLButtonElement | null;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = this.container.querySelector('.card__title') as HTMLElement;
        this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
        this.categoryElement = this.container.querySelector('.card__category') as HTMLElement;
        this.priceElement = this.container.querySelector('.card__price') as HTMLElement;
        this.buttonElement = this.container.querySelector('.card__button') as HTMLButtonElement | null;
    }

    public setProduct(product: IProduct): void {
        this.id = product.id;

        this.titleElement.textContent = product.title;
        this.categoryElement.textContent = product.category;

        const modifier =
            categoryMap[product.category as keyof typeof categoryMap] ?? categoryMap['другое'];

        this.categoryElement.className = `card__category ${modifier}`;

        this.imageElement.src = `${CDN_URL}${product.image}`;
        this.imageElement.alt = product.title;

        if (product.price === null) {
            this.priceElement.textContent = 'Недоступно';
            if (this.buttonElement) {
                this.buttonElement.disabled = true;
                this.buttonElement.textContent = 'Недоступно';
            }
        } else {
            this.priceElement.textContent = `${product.price} синапсов`;
            if (this.buttonElement) {
                this.buttonElement.disabled = false;
                this.buttonElement.textContent = 'Купить';
            }
        }
    }

    public setButtonHandler(handler: (id: string) => void): void {
        if (this.buttonElement) {
            this.buttonElement.onclick = () => handler(this.id);
        }
    }

    public render(): HTMLElement {
        return this.container;
    }
}