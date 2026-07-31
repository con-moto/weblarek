import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Catalog extends EventEmitter {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  constructor() {
    super();
  }

  public setItems(items: IProduct[]): void {
    this.items = items;
    this.emit('catalog:change');
  }

  public getItems(): IProduct[] {
    return this.items;
  }

  public getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  public setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
    this.emit('catalog:selected', { id: item.id });
  }

  public getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}