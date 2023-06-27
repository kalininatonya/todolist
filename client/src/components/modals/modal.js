import {createElement} from '../../helpers/helpers';
import './modal.scss';

//Контейнер для модалок
export const renderModalContainer = (headingText) => {
    const main = document.getElementById('main');

    const modalContainerAtr = {
        id: 'modal',
        className: 'modal',
    };
    const modalContainer = createElement(main, 'div', modalContainerAtr);

    createElement(modalContainer, 'div', {className: 'modal__overlay'});

    const modalContent = createElement(modalContainer, 'div', {className: 'modal__content'});
    const modalHeader = createElement(modalContent, 'header', {className: 'modal__header'});

    const headingAtr = {
        innerHTML: `${headingText}`,
        className: 'modal__heading',
    };
    createElement(modalHeader, 'h2', headingAtr);
    createElement(modalHeader, 'button', {className: 'modal__icon-close'});
}
