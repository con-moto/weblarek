import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Basket extends EventEmitter {
  private items: IProduct[] = [];

  constructor() {
    super();
  }

  public getItems(): IProduct[] {
    return this.items;
  }

  public addItem(item: IProduct): void {
    this.items.push(item);
    this.emit('basket:change');
  }

  public removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.emit('basket:change');
  }

  public clearBasket(): void {
    this.items = [];
    this.emit('basket:change');
  }

  public getTotal(): number {
    return this.items.reduce((acc, item) => acc + (item.price ?? 0), 0);
  }

  public getCount(): number {
    return this.items.length;
  }

  public hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}