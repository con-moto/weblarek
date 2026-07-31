import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class ProductCard extends Component<IProduct> {
    private id: string = '';
    private categoryElement: HTMLElement;
    private titleElement: HTMLElement;
    private imageElement: HTMLImageElement;
    private priceElement: HTMLElement;
    private clickHandler: ((id: string) => void) | null = null;

    constructor(container: HTMLElement) {
        super(container);
        this.categoryElement = this.container.querySelector('.card__category') as HTMLElement;
        this.titleElement = this.container.querySelector('.card__title') as HTMLElement;
        this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
        this.priceElement = this.container.querySelector('.card__price') as HTMLElement;

        this.container.addEventListener('click', () => {
            if (this.clickHandler) {
                this.clickHandler(this.id);
            }
        });
    }

    public setProduct(product: IProduct): void {
        this.id = product.id;
        this.titleElement.textContent = product.title;
        this.categoryElement.textContent = product.category;

        const modifier = categoryMap[product.category as keyof typeof categoryMap] ?? categoryMap['другое'];
        this.categoryElement.className = `card__category ${modifier}`;

        this.imageElement.src = `${CDN_URL}${product.image}`;
        this.imageElement.alt = product.title;

        if (product.price === null) {
            this.priceElement.textContent = 'Недоступно';
        } else {
            this.priceElement.textContent = `${product.price} синапсов`;
        }
    }

    public setClickHandler(handler: (id: string) => void): void {
        this.clickHandler = handler;
    }

    public renderCard(product: IProduct, handler: (id: string) => void): HTMLElement {
        this.setProduct(product);
        this.setClickHandler(handler);
        return this.container;
    }
}