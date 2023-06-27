import {options} from '../../../constant';
import {createElement} from '../../../helpers/helpers';
import './addForm.scss';

export const renderAddForm = (container) => {
    const addFormAtr = {id: 'addForm', className: 'addForm'};
    const addForm = createElement(container, 'form', addFormAtr);

    const titleAtr = {
        id: 'addForm-field',
        type: 'text',
        name: 'title',
        placeholder: 'Title',
        className: 'addForm__field',
    };
    createElement(addForm, 'input', titleAtr);

    const priorityAtr = {
        id: 'addForm-field',
        name: 'priority',
        className: 'addForm__field',
    };
    const priority = createElement(addForm, 'select', priorityAtr);
    for (let {text, value} of options) {
        let newOption = null;
        if (value === 'small') {
            newOption = new Option(text, value, true, true);
        } else {
            newOption = new Option(text, value);
        }
        priority.append(newOption);
    }

    const descriptionAtr = {
        id: 'addForm-field',
        name: 'description',
        placeholder: 'Description',
        rows: 5,
        cols: 45,
        className: 'addForm__description',
    };
    createElement(addForm, 'textarea', descriptionAtr);

    const buttonsContainer = createElement(addForm, 'div', {className: 'addForm__btn-container'});

    const buttonSubmitAtr = {
        type: 'submit',
        innerHTML: 'Добавить',
        className: 'addForm__btn-add',
    };
    createElement(buttonsContainer, 'button', buttonSubmitAtr)

    const buttonCloseAtr = {
        type: 'button',
        innerHTML: 'Отмена',
        className: 'addForm__btn-close'
    };
    createElement(buttonsContainer, 'button', buttonCloseAtr);
}