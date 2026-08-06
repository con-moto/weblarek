import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
    private items: IProduct[] = [];

    constructor(private readonly events: IEvents) {}

    public getItems(): IProduct[] {
        return this.items;
    }

    public addItem(item: IProduct): void {
        this.items.push(item);
        this.events.emit('basket:change');
    }

    public removeItem(id: string): void {
        this.items = this.items.filter((item) => item.id !== id);
        this.events.emit('basket:change');
    }

    public clearBasket(): void {
        this.items = [];
        this.events.emit('basket:change');
    }

    public getTotal(): number {
        return this.items.reduce(
            (total, item) => total + (item.price ?? 0),
            0
        );
    }

    public getCount(): number {
        return this.items.length;
    }

    public hasItem(id: string): boolean {
        return this.items.some((item) => item.id === id);
    }
}