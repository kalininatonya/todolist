import {options} from '../../../constant';
import {createElement} from '../../../helpers/helpers';
import './viewForm.scss';

export const renderViewForm = (container, card) => {
    const viewFormAtr = {
        id: 'viewForm',
        className: 'viewForm',
    };
    const viewForm = createElement(container, 'form', viewFormAtr);

    const titleAtr = {
        id: 'viewForm__field',
        value: `${card.title}`,
        type: 'text',
        name: 'title',
        disabled: true,
        className: 'viewForm__field',
    }
    createElement(viewForm, 'input', titleAtr);

    const order = options.find((option) => option.priority === card.priority);
    const priorityAtr = {
        id: 'viewForm-field',
        value: `${order.text}`,
        type: 'string',
        name: 'priority',
        disabled: true,
        className: 'viewForm__field'
    }
    createElement(viewForm, 'input', priorityAtr);

    const descriptionAtr = {
        id: 'viewForm-field',
        value: `${card.description}`,
        name: 'description',
        rows: 5,
        cols: 45,
        disabled: true,
        className: 'viewForm__description',
    };
    createElement(viewForm, 'textarea', descriptionAtr);

    const buttonCloseAtr = {
        type: 'button',
        innerHTML: 'Вернуться на главную',
        className: 'viewForm__btn-close',
    };
    createElement(viewForm, 'button', buttonCloseAtr);
}