import { IApi } from '../../types';
import { IProductsResponse, IOrderRequest, IOrderResponse } from '../../types';

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  public getProducts(): Promise<IProductsResponse> {
    return this.api.get('/product/') as Promise<IProductsResponse>;
  }

  public createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post('/order/', order) as Promise<IOrderResponse>;
  }
}