import { IProduct } from '../../types';

export class Basket {
  private items: IProduct[] = [];

  constructor() {}

  public getItems(): IProduct[] {
    return this.items;
  }

  public addItem(item: IProduct): void {
    this.items.push(item);
  }

  public removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  public clearBasket(): void {
    this.items = [];
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