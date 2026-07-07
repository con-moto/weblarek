import { IProduct } from '../../types';

export class Catalog {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  constructor() {}

  public setItems(items: IProduct[]): void {
    this.items = items;
  }

  public getItems(): IProduct[] {
    return this.items;
  }

  public getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  public setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  public getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}