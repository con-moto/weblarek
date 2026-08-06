import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<HTMLElement> {
    private content: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        private readonly events: IEvents
    ) {
        super(container);

        this.content = this.container.querySelector(
            '.modal__content'
        ) as HTMLElement;

        this.closeButton = this.container.querySelector(
            '.modal__close'
        ) as HTMLButtonElement;

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit('modal:close');
            }
        });
    }

    public setContent(element: HTMLElement): void {
        this.content.replaceChildren(element);
    }

    public open(): void {
        this.container.classList.add('modal_active');
    }

    public close(): void {
        this.container.classList.remove('modal_active');
    }
}