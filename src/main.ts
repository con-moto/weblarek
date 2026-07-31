import './scss/styles.scss';
import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/models/WebLarekApi';
import { API_URL } from './utils/constants';
import { CatalogView } from './components/view/CatalogView';
import { ProductCard } from './components/view/ProductCard';
import { Modal } from './components/view/Modal';
import { ProductCardInModal } from './components/view/ProductCardInModal';
import { BasketIcon } from './components/view/BasketIcon';
import { BasketView } from './components/view/BasketView';
import { ProductCardInBasket } from './components/view/ProductCardInBasket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { SuccessView } from './components/view/SuccessView';

const catalog = new Catalog();
const basket = new Basket();
const buyer = new Buyer();

const baseApi = new Api(API_URL, {
    headers: {
        'Content-Type': 'application/json',
    },
});

const webLarekApi = new WebLarekApi(baseApi);

const gallery = document.querySelector('.gallery') as HTMLElement;
const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const modalElement = document.querySelector('#modal-container') as HTMLElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const basketButton = document.querySelector('.header__basket') as HTMLElement;

const catalogView = new CatalogView(gallery);
const modal = new Modal(modalElement);
const basketIcon = new BasketIcon(basketButton);

const renderContactsForm = () => {
    const contactsElement = contactsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const contactsForm = new ContactsForm(contactsElement);
    const buyerData = buyer.getBuyerData();

    contactsForm.setEmail(buyerData.email);
    contactsForm.setPhone(buyerData.phone);

    const form = contactsForm.getElement() as HTMLFormElement;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = contactsForm.getData();
        buyer.setBuyerData(data);

        if (!contactsForm.isValid()) {
            contactsForm.setErrors('Заполните email и телефон');
            return;
        }

        const order = {
            items: basket.getItems().map((item) => item.id),
            payment: buyer.getBuyerData().payment!,
            email: buyer.getBuyerData().email,
            phone: buyer.getBuyerData().phone,
            address: buyer.getBuyerData().address,
            total: basket.getTotal(),
        };

        webLarekApi.createOrder(order)
            .then((response) => {
                const successElement = successTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
                const successView = new SuccessView(successElement);

                successView.setCloseHandler(() => {
                    basket.clearBasket();
                    buyer.clearBuyerData();
                    modal.close();
                });

                modal.setContent(successView.render(response.total));
                modal.open();
            })
            .catch((error) => {
                console.error('Ошибка при создании заказа:', error);
            });
    });

    modal.setContent(contactsForm.render());
    modal.open();
};

const renderOrderForm = () => {
    const orderElement = orderTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const orderForm = new OrderForm(orderElement);
    const buyerData = buyer.getBuyerData();

    orderForm.setPayment(buyerData.payment ?? 'card');
    orderForm.setAddress(buyerData.address);

    const form = orderForm.getElement() as HTMLFormElement;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = orderForm.getData();
        buyer.setBuyerData(data);

        if (!orderForm.isValid()) {
            orderForm.setErrors('Заполните способ оплаты и адрес доставки');
            return;
        }

        renderContactsForm();
    });

    modal.setContent(orderForm.render());
    modal.open();
};

const renderBasket = () => {
    const basketElement = basketTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const basketView = new BasketView(basketElement);

    const items = basket.getItems().map((product, index) => {
        const basketCardElement = basketCardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const basketCard = new ProductCardInBasket(basketCardElement);

        return basketCard.renderItem(product, index + 1, (id) => {
            basket.removeItem(id);
            modal.setContent(renderBasket());
            modal.open();
        });
    });

    basketView.setOrderHandler(() => {
        renderOrderForm();
    });

    return basketView.render({
        items,
        total: basket.getTotal(),
        disabled: basket.getCount() === 0,
    });
};

const renderCatalog = () => {
    const cards = catalog.getItems().map((product) => {
        const cardElement = cardTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const card = new ProductCard(cardElement);
        return card.renderCard(product, renderPreview);
    });

    catalogView.render(cards);
};

const renderPreview = (id: string) => {
    const product = catalog.getItem(id);

    if (!product) {
        return;
    }

    const previewElement = previewTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
    const previewCard = new ProductCardInModal(previewElement);
    const inBasket = basket.hasItem(product.id);

    previewCard.setClickHandler((productId) => {
        const selectedProduct = catalog.getItem(productId);

        if (!selectedProduct) {
            return;
        }

        if (basket.hasItem(selectedProduct.id)) {
            basket.removeItem(selectedProduct.id);
        } else {
            basket.addItem(selectedProduct);
        }

        modal.close();
    });

    previewCard.setProduct(product, inBasket);
    modal.setContent(previewCard.getElement());
    modal.open();
};

catalog.on('catalog:change', () => {
    renderCatalog();
});

basket.on('basket:change', () => {
    basketIcon.render(basket.getCount());
});

basketButton.addEventListener('click', () => {
    modal.setContent(renderBasket());
    modal.open();
});

webLarekApi.getProducts()
    .then((response) => {
        catalog.setItems(response.items);
    })
    .catch((error) => {
        console.error('Ошибка при запросе каталога товаров:', error);
    });