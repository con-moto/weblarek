import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog {
    private items: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    constructor(private readonly events: IEvents) {}

    public setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('catalog:change');
    }

    public getItems(): IProduct[] {
        return this.items;
    }

    public getItem(id: string): IProduct | undefined {
        return this.items.find((item) => item.id === id);
    }

    public setSelectedItem(item: IProduct): void {
        this.selectedItem = item;
        this.events.emit('catalog:selected');
    }

    public getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }

    public clearSelectedItem(): void {
        this.selectedItem = null;
    }
}