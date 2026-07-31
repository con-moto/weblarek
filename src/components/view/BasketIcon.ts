import { Component } from '../base/Component';

export class BasketIcon extends Component<number> {
    private counterElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.counterElement = this.container.querySelector('.header__basket-counter') as HTMLElement;
    }

    public setCount(count: number): void {
        this.counterElement.textContent = String(count);
    }

    public render(count: number = 0): HTMLElement {
        this.setCount(count);
        return this.container;
    }
}