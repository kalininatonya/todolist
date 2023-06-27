import axios from 'axios';

export const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000/api'
});

export const cardsAPI = {
    async getCard(cardId) {
        const response = await instance.get(`/cards/${cardId}`);
        return response.data;
    },

    async listCards() {
        const response = await instance.get('/cards');
        return response.data;
    },

    //По возрастанию
    async sortCardsAscending() {
        const response = await instance.get('/cards?_sort=priority,views&_order=desc,asc');
        return response.data;
    },

    //По убыванию
    async sortCardsDescending() {
        const response = await instance.get('/cards?_sort=priority,views&_order=asc,desc');
        return response.data;
    },

    async addCard(formData) {
        const response = await instance.post('/cards', formData);
        return response.data;
    },

    async deleteCard(cardId) {
        const response = await instance.delete(`/cards/${cardId}`);
        return response.data;
    }
}