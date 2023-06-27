import {object, string} from 'yup';
import onChange from 'on-change';
import {options, sort, warnings} from './constant';
import {cardsAPI} from './api/cardsAPI';
import {renderModalContainer} from './components/modals/modal';
import {renderAddForm} from './components/forms/addForm/addForm';
import {renderViewForm} from './components/forms/viewForm/viewForm';
import {renderCards} from './components/cards/cards';
import './styles/list.scss';

//Валидация
const formSchema = object({
    title: string().trim().required(warnings.requiredField)
});

const application = async () => {
    const state = {
        card: null,
        cards: [],
        isAddModalOpen: false,
        isViewModalOpen: false,
        addForm: {
            data: {
                title: '',
                priority: 'small',
                description: '',
            },
            errors: [],
            formState: 'invalid',
        },
        sortByPriority: '',
        processError: '',
        startClientY: null,
        endClientY: null,
        activeCardId: null, //Карточка, которую зацепили
        currentCardId: null, //Карточка, на место которой хотим поставить activeCard
        moving: '',
    };

    const container = document.querySelector('#main');
    const buttonAdd = document.querySelector('#btn-add');
    let addForm = null;

    //Вотчер - перерисовывает данные на основе стейта
    const watchedState = onChange(state, (path, value) => {
        switch (path) {
            case 'cards':
                //Удаляем карточки и надпись чтобы повторно отрендерить
                const cardsContainer = container.querySelector('.cards');
                if (cardsContainer !== null) {
                    cardsContainer.remove();
                }
                const cardsWarning = document.querySelector('.cards__warning');
                cardsWarning !== null && cardsWarning.remove();

                renderCards(container, value);
                if (value.length !== 0) {
                    const cardsNewContainer = container.querySelector('.cards');

                    const sortByPriorityButton = document.createElement('button');
                    sortByPriorityButton.innerHTML = 'Сортировать по приоритету';
                    sortByPriorityButton.type = 'button';
                    sortByPriorityButton.className = 'sortButton';
                    cardsNewContainer.prepend(sortByPriorityButton);
                    sortByPriorityHandler(sortByPriorityButton);

                    moveHandler(cardsNewContainer);
                    viewHandler();
                    buttonsDeleteHandler();
                }
                break;
            case 'moving':
                const cardsMainContainer = container.querySelector('.cards');
                const cards = cardsMainContainer.querySelectorAll('.cards__card');

                let activeCard = null;
                let currentCard = null;

                for (let item of cards) {
                    if (item.id === state.activeCardId) {
                        activeCard = item;
                    }
                    if (item.id === state.currentCardId) {
                        currentCard = item;
                    }
                }

                if (value === 'dragstart') {
                    activeCard !== null && activeCard.classList.add(`selected`);
                }

                if (value === 'dragend') {
                    activeCard !== null && activeCard.classList.remove(`selected`);
                    if (state.startClientY > state.endClientY) {
                        currentCard.before(activeCard);
                    } else {
                        currentCard.after(activeCard);
                    }
                    const items = cardsMainContainer.querySelectorAll('.cards__card');
                    changeCardsOrder(items); //Чтобы при обновлении страницы сохранялось состояние элементов
                }
                break;
            case 'isViewModalOpen':
                if (value) {
                    const heading = 'Просмотр задачи';
                    renderModalContainer(heading);

                    const modalContent = document.querySelector('.modal__content');
                    renderViewForm(modalContent, state.card);

                    const buttonClose = document.querySelector('.viewForm__btn-close');
                    closeViewModalHandler(buttonClose);

                    const iconClose = document.querySelector('.modal__icon-close');
                    closeViewModalHandler(iconClose);
                } else {
                    const modalContainer = document.querySelector('.modal');
                    modalContainer.remove();
                }
                break;
            case 'isAddModalOpen':
                if (value) {
                    const heading = 'Создание задачи';
                    renderModalContainer(heading);

                    const modalContent = document.querySelector('.modal__content');
                    renderAddForm(modalContent);

                    const buttonClose = document.querySelector('.addForm__btn-close');
                    closeAddModalHandler(buttonClose);

                    const iconClose = document.querySelector('.modal__icon-close');
                    closeAddModalHandler(iconClose);

                    const buttonSubmit = document.querySelector('.addForm__btn-add');
                    buttonSubmit.disabled = true;

                    addForm = document.querySelector('#addForm');
                    formControlsHandler(addForm);
                    formHandler(addForm);
                } else {
                    const modalContainer = document.querySelector('.modal');
                    modalContainer.remove();
                }
                break;
            case 'addForm.errors':
                //Удаляем ошибки если они есть
                const divsInvalid = addForm.querySelectorAll('#error');
                removeErrors(divsInvalid);

                //Добавляем ошибки
                for (const {message, path} of value) {
                    const inputInvalid = addForm.querySelector(`[name=${path}]`);
                    inputInvalid.classList.add('addForm__field-invalid');

                    const divInvalid = document.createElement('div');
                    divInvalid.id = 'error';
                    divInvalid.innerHTML = message;
                    divInvalid.classList.add('addForm__error');
                    inputInvalid.after(divInvalid);
                }
                break;
            case 'addForm.data.priority':
            case 'addForm.data.title':
                const divsIn = addForm.querySelectorAll('#error');
                const newValue = value.trim();
                if (newValue !== '') {
                    removeErrors(divsIn);
                }
                const butSubmit = document.querySelector('.addForm__btn-add');
                butSubmit.disabled = state.addForm.formState !== 'valid';
                break;
            case 'addForm.formState':
                const buttonSubmit = document.querySelector('.addForm__btn-add');
                buttonSubmit.disabled = value !== 'valid';
                break;
            case 'processError':
                const warning = document.createElement('div');
                warning.innerHTML = value;
                warning.className = 'cards__warning';
                container.append(warning);
                break;
        }
    });

    //Подгружаем список карточек
    async function listCards() {
        try {
            const cards = await cardsAPI.listCards();
            watchedState.cards = [...cards];
        } catch (err) {
            console.log(err.message);
            watchedState.processError = warnings.processError;
        }
    }

    await listCards();

    //Подгружаем уже отсортированный на сервере список карточек
    async function sortListCards() {
        try {
            let cards;
            if (watchedState.sortByPriority === sort.desc) {
                cards = await cardsAPI.sortCardsDescending();
            } else {
                cards = await cardsAPI.sortCardsAscending();
            }
            watchedState.cards = [...cards];
        } catch (err) {
            console.log(err.message);
            watchedState.processError = warnings.processError;
        }
    }

    function removeErrors(divsInvalid) {
        divsInvalid.length !== 0 && divsInvalid.forEach(divInvalid => {
            const inputInvalid = addForm.querySelector('.addForm__field-invalid');
            inputInvalid.classList.remove('addForm__field-invalid');
            divInvalid.remove();
        });
    }

    //Меняем порядок карточек в массиве
    async function changeCardsOrder(cards) {
        const newCards = [];
        for (let card of cards) {
            const item = state.cards.find((el) => el.id === Number(card.id));
            newCards.push(item);
        }

        try {
            for (let el of newCards) {
                await cardsAPI.deleteCard(el.id);
                await cardsAPI.addCard(el);
            }
            await listCards();
        } catch (err) {
            console.log(err.message);
            watchedState.processError = warnings.processError;
        }
    }

    function sortByPriorityHandler(element) {
        element.addEventListener('click', async () => {
            switch (watchedState.sortByPriority) {
                case '':
                case sort.desc:
                    watchedState.sortByPriority = sort.asc; //По возрастанию
                    break;
                case sort.asc:
                    watchedState.sortByPriority = sort.desc; //По Убыванию
                    break;
            }
            await sortListCards();
        });
    }

    function moveHandler(element) {
        //Узнаем какой элемент на данный момент перетаскивается.
        element.addEventListener('dragstart', (event) => {
            watchedState.startClientY = event.clientY;
            watchedState.activeCardId = event.target.id;
            watchedState.moving = 'dragstart';
        });

        //Разрешаем сбрасывать элементы в эту область
        element.addEventListener('dragover', (event) => {
            event.preventDefault();
            watchedState.currentCardId = event.target.id;
            watchedState.moving = 'dragover';
        });

        //Завершаем перетаскивание
        element.addEventListener('dragend', (event) => {
            watchedState.endClientY = event.clientY;
            watchedState.activeCardId = event.target.id;
            watchedState.sortByPriority = '';
            watchedState.moving = 'dragend';
        });
    }

    //Просмотр карточки
    function viewHandler() {
        const titles = container.querySelectorAll('.cards__title');
        titles.forEach(title => {
            title.addEventListener('click', async (e) => {
                const {id} = e.target;
                watchedState.card = await cardsAPI.getCard(id);
                watchedState.isViewModalOpen = true;
            })
        })
    }

    //Удаление карточки
    function buttonsDeleteHandler() {
        const buttonsDelete = container.querySelectorAll('.cards__icon-delete');
        buttonsDelete.forEach(button => {
            button.addEventListener('click', async (e) => {
                const {id} = e.target;
                try {
                    await cardsAPI.deleteCard(id);
                    await listCards();
                } catch (err) {
                    console.log(err.message);
                    watchedState.processError = warnings.processError;
                }
            });
        })
    }

    //Открываем модалку добавления карточки
    buttonAdd.addEventListener('click', () => {
        watchedState.isAddModalOpen = true;
    });

    //Закрываем модалку добавления карточки
    function closeAddModalHandler(element) {
        element.addEventListener('click', async () => {
            watchedState.isAddModalOpen = false;
            await listCards();
        });
    }

    //Закрываем модалку просмотра карточки
    function closeViewModalHandler(element) {
        element.addEventListener('click', async () => {
            watchedState.isViewModalOpen = false;
        });
    }

    //Навешиваем обработчики на инпуты
    function formControlsHandler(form) {
        const elements = form.querySelectorAll('#addForm-field');
        elements.forEach(element => {
            element.addEventListener('input', (e) => {
                const {value, name} = e.target;
                watchedState.addForm.data[name] = value;
                try {
                    //Если ввели значение в инпуты без ошибок то меняем стейт на валид
                    formSchema.validateSync(state.addForm.data, {abortEarly: false});
                    watchedState.addForm.formState = 'valid';
                } catch (err) {
                    //Если есть ошибки валидации то записываем их в массив в стейте и меняем форму на инвалид;
                    watchedState.addForm.errors = err.inner;
                    watchedState.addForm.formState = 'invalid';
                }
            });
        });
    }

    //Добавление карточки
    //Навешиваем обработчик на форму
    function formHandler(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (state.addForm.formState === 'valid') {
                watchedState.addForm.formState = 'pending';
                try {
                    const list = await cardsAPI.listCards();
                    const maxId = list.reduce((max, card) => card.id > max ? card.id : max, 0);

                    const {data} = state.addForm;
                    const order = options.find(option => option.value === data.priority);
                    await cardsAPI.addCard({...data, priority: Number(order.priority), id: maxId + 1});

                    //Возвращаем стейт в исходное состояние
                    watchedState.addForm.data = {
                        title: '',
                        priority: 'small',
                        description: '',
                    };
                    watchedState.addForm.formState = 'valid';
                    watchedState.isAddModalOpen = false;
                    await listCards();
                } catch (err) {
                    console.log(err.message);
                    watchedState.processError = warnings.processError;
                    watchedState.addForm.formState = 'invalid';
                }
            }
        });
    }
}

await application();