export function cloneTemplate<T extends HTMLElement>(
    template: HTMLTemplateElement
): T {
    return template.content.firstElementChild!.cloneNode(true) as T;
}