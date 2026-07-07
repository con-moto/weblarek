import './scss/styles.scss';
import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/models/WebLarekApi';
import { API_URL } from './utils/constants'

const catalog = new Catalog();
const basket = new Basket();
const buyer = new Buyer();

catalog.setItems(apiProducts.items);
console.log('Все товары в каталоге:', catalog.getItems());

const productById = catalog.getItem(apiProducts.items[0].id);
console.log('Товар из каталога по id:', productById);

if (productById) {
  catalog.setSelectedItem(productById);
  console.log('Выбранный товар для отображения:', catalog.getSelectedItem());
}

console.log('Проверка выбранного товара:', catalog.getSelectedItem()?.id === apiProducts.items[0].id? 'Выбран правильный товар': 'Выбранный товар не совпадает с ожидаемым');

basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
console.log('Товары в корзине после добавления:', basket.getItems());
console.log('Количество товаров в корзине:', basket.getCount());
console.log('Общая стоимость корзины:', basket.getTotal());
console.log('Есть ли в корзине первый товар:', basket.hasItem(apiProducts.items[0].id));

basket.removeItem(apiProducts.items[0].id);
console.log('Товары в корзине после удаления первого товара:', basket.getItems());
console.log('Количество товаров в корзине после удаления:', basket.getCount());
console.log('Общая стоимость корзины после удаления:', basket.getTotal());
console.log('Есть ли в корзине первый товар после удаления:', basket.hasItem(apiProducts.items[0].id));

basket.clearBasket();
console.log('Товары в корзине после очистки:', basket.getItems());
console.log('Количество товаров в корзине после очистки:', basket.getCount());
console.log('Общая стоимость корзины после очистки:', basket.getTotal());

buyer.setBuyerData({
  payment: 'card',
  email: 'user@example.com',
});
console.log('Данные покупателя после первого вызова setBuyerData:', buyer.getBuyerData());
buyer.setBuyerData({
  address: 'Адрес доставки',
  phone: '+7-999-000-00-00',
});
console.log('Данные покупателя после второго вызова setBuyerData:', buyer.getBuyerData());

console.log('Ошибки валидации (все поля заполнены):', buyer.validate());

buyer.clearBuyerData();
console.log('Данные покупателя после очистки:', buyer.getBuyerData());
console.log('Ошибки валидации после очистки:', buyer.validate());

const baseApi = new Api(API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});

const webLarekApi = new WebLarekApi(baseApi);

webLarekApi.getProducts()
  .then((response) => {
    console.log('Ответ сервера /product/:', response);
    catalog.setItems(response.items);
    console.log('Каталог после загрузки с сервера:', catalog.getItems());
  })
  .catch((error) => {
    console.error('Ошибка при запросе каталога товаров:', error);
  });