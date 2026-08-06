import './scss/styles.scss';

import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/models/WebLarekApi';
import { EventEmitter } from './components/base/Events';

import { API_URL, CDN_URL} from './utils/constants';
import { cloneTemplate } from './utils/cloneTemplate';

import {
    IProduct,
    TPayment,
} from './types';

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

const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const baseApi = new Api(API_URL, {
    headers: {
        'Content-Type': 'application/json',
    },
});

const webLarekApi = new WebLarekApi(baseApi);

const gallery = document.querySelector('.gallery') as HTMLElement;

const cardTemplate = document.querySelector(
    '#card-catalog'
) as HTMLTemplateElement;

const previewTemplate = document.querySelector(
    '#card-preview'
) as HTMLTemplateElement;

const modalElement = document.querySelector(
    '#modal-container'
) as HTMLElement;

const basketTemplate = document.querySelector(
    '#basket'
) as HTMLTemplateElement;

const basketCardTemplate = document.querySelector(
    '#card-basket'
) as HTMLTemplateElement;

const orderTemplate = document.querySelector(
    '#order'
) as HTMLTemplateElement;

const contactsTemplate = document.querySelector(
    '#contacts'
) as HTMLTemplateElement;

const successTemplate = document.querySelector(
    '#success'
) as HTMLTemplateElement;

const basketButton = document.querySelector(
    '.header__basket'
) as HTMLElement;

const catalogView = new CatalogView(gallery);
const modal = new Modal(modalElement, events);
const basketIcon = new BasketIcon(basketButton);

const basketView = new BasketView(
    cloneTemplate<HTMLElement>(basketTemplate),
    events
);

const previewCard = new ProductCardInModal(
    cloneTemplate<HTMLElement>(previewTemplate)
);

const orderForm = new OrderForm(
    cloneTemplate<HTMLElement>(orderTemplate),
    events
);

const contactsForm = new ContactsForm(
    cloneTemplate<HTMLElement>(contactsTemplate),
    events
);

const successView = new SuccessView(
    cloneTemplate<HTMLElement>(successTemplate),
    events
);

previewCard.setClickHandler(() => {
    events.emit('card:action');
});

const renderContactsForm = (): void => {
    const buyerData = buyer.getBuyerData();

    contactsForm.setEmail(buyerData.email);
    contactsForm.setPhone(buyerData.phone);
    contactsForm.clearErrors();

    modal.setContent(contactsForm.getElement());
    modal.open();
};

const renderOrderForm = (): void => {
    const buyerData = buyer.getBuyerData();

    if (buyerData.payment) {
        orderForm.setPayment(buyerData.payment);
    }

    orderForm.setAddress(buyerData.address);
    orderForm.clearErrors();

    modal.setContent(orderForm.getElement());
    modal.open();
};

const renderBasket = (): HTMLElement => {
    const items = basket.getItems().map((product, index) => {
        const basketCardElement =
            cloneTemplate<HTMLElement>(basketCardTemplate);

        const basketCard = new ProductCardInBasket(
            basketCardElement
        );

        return basketCard.renderItem(
            product,
            index + 1,
            () => {
                events.emit('basket:remove', {
                    product,
                });
            }
        );
    });

    return basketView.render({
        items,
        total: basket.getTotal(),
        disabled: basket.getCount() === 0,
    });
};

const renderCatalog = (): void => {
    const cards = catalog.getItems().map((product) => {
        const cardElement =
            cloneTemplate<HTMLElement>(cardTemplate);

        const card = new ProductCard(cardElement);

        return card.renderCard(product, () => {
            events.emit('card:select', {
                product,
            });
        });
    });

    catalogView.render(cards);
};

const renderPreview = (): void => {
    const product = catalog.getSelectedItem();

    if (!product) {
        return;
    }

    const inBasket = basket.hasItem(product.id);

    previewCard.setProduct(product, inBasket);

    modal.setContent(previewCard.getElement());
    modal.open();
};

events.on<{
    formName: string;
    field: string;
    value: string;
}>('form:input', ({ formName, field, value }) => {
    if (formName === 'order') {
        if (field === 'payment') {
            buyer.setBuyerData({
                payment: value as TPayment,
            });
        }

        if (field === 'address') {
            buyer.setBuyerData({
                address: value,
            });
        }
    }

    if (formName === 'contacts') {
        if (field === 'email') {
            buyer.setBuyerData({
                email: value,
            });
        }

        if (field === 'phone') {
            buyer.setBuyerData({
                phone: value,
            });
        }
    }
});

events.on<{ formName: string }>(
    'form:submit',
    ({ formName }) => {
        const errors = buyer.validate();

        if (formName === 'order') {
            const orderErrors = [
                errors.payment,
                errors.address,
            ].filter(Boolean);

            if (orderErrors.length > 0) {
                orderForm.setErrors(
                    orderErrors.join('. ')
                );
                return;
            }

            orderForm.clearErrors();
            renderContactsForm();

            return;
        }

        if (formName === 'contacts') {
            const contactsErrors = [
                errors.email,
                errors.phone,
            ].filter(Boolean);

            if (contactsErrors.length > 0) {
                contactsForm.setErrors(
                    contactsErrors.join('. ')
                );
                return;
            }

            contactsForm.clearErrors();

            const currentBuyer = buyer.getBuyerData();

            const order = {
                items: basket.getItems().map(
                    (item) => item.id
                ),
                payment: currentBuyer.payment!,
                email: currentBuyer.email,
                phone: currentBuyer.phone,
                address: currentBuyer.address,
                total: basket.getTotal(),
            };

            webLarekApi
                .createOrder(order)
                .then((response) => {
                    basket.clearBasket();
                    buyer.clearBuyerData();

                    successView.setTotal(response.total);

                    modal.setContent(
                        successView.getElement()
                    );

                    modal.open();
                })
                .catch((error) => {
                    console.error(
                        'Ошибка при создании заказа:',
                        error
                    );
                });
        }
    }
);

events.on<{ product: IProduct }>(
    'card:select',
    ({ product }) => {
        catalog.setSelectedItem(product);
        renderPreview();
    }
);

events.on(
    'card:action',
    () => {
        const selectedProduct =
            catalog.getSelectedItem();

        if (!selectedProduct) {
            return;
        }

        if (basket.hasItem(selectedProduct.id)) {
            basket.removeItem(selectedProduct.id);
        } else {
            basket.addItem(selectedProduct);
        }

        modal.close();
    }
);

events.on<{ product: IProduct }>(
    'basket:remove',
    ({ product }) => {
        basket.removeItem(product.id);
    }
);

events.on('basket:order', () => {
    renderOrderForm();
});

events.on('basket:open', () => {
    modal.setContent(renderBasket());
    modal.open();
});

events.on('modal:close', () => {
    modal.close();
});

events.on('success:close', () => {
    modal.close();
});

events.on('catalog:change', () => {
    renderCatalog();
});

events.on('basket:change', () => {
    basketIcon.render(basket.getCount());

    if (
        modalElement.classList.contains('modal_active') &&
        modalElement.querySelector('.basket')
    ) {
        modal.setContent(renderBasket());
    }
});

basketButton.addEventListener('click', () => {
    events.emit('basket:open');
});

webLarekApi
    .getProducts()
    .then((response) => {
        const products = response.items.map((product) => ({
            ...product,
            image: `${CDN_URL}${product.image}`,
        }));

        catalog.setItems(products);
    })
    .catch((error) => {
        console.error(
            'Ошибка при запросе каталога товаров:',
            error
        );
    });