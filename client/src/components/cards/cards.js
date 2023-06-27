import {options} from '../../constant';
import {createElement} from '../../helpers/helpers';
import './cards.scss';

const maxPriority = options.reduce((acc, curr) => acc.priority > curr.priority ? acc : curr).priority;

export const renderCards = (container, cards) => {
    if (cards.length !== 0) {
        const cardsContainer = createElement(container, 'section', {className: 'cards'});
        const list = createElement(cardsContainer, 'ol');

        for (let i = 0; i < cards.length; i++) {
            const cardAtr = {id: `${cards[i].id}`, draggable: true, className: 'cards__card'};
            const card = createElement(list, 'li', cardAtr);

            const titleAtr = {id: `${cards[i].id}`, className: 'cards__title', innerHTML: `${cards[i].title}`};
            createElement(card, 'button', titleAtr);

            const iconsContainer = createElement(card, 'div', {className: 'cards__iconsContainer'});

            const iconDeleteAtr = {
                id: `${cards[i].id}`,
                type: 'button',
                className: 'cards__icon-delete',
            };
            createElement(iconsContainer, 'button', iconDeleteAtr);

            if (cards[i].priority === Number(maxPriority)) {
                createElement(iconsContainer, 'div', {className: 'cards__icon-screamer'});
            }
        }

    } else {
        const warningAtr = {className: 'cards__warning', innerHTML: 'Нет задач'};
        createElement(container, 'div', warningAtr);
    }
};