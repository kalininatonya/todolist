export const createElement = (parent, HTMLElement, rest = null) => {
    const element = document.createElement(HTMLElement);
    if (rest) {
        const keys = Object.keys(rest);
        for (let key of keys) {
            element[key] = rest[key];
        }
    }

    parent.append(element);

    return element;
}