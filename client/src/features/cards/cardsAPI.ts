import axios from '@/services/api';
import type { Card, CardStatus } from '@/types/card';

export const cardsAPI = {
    createCard: (boardId: string, title: string) =>
        axios.post<Card>('/cards', { boardId, title }),

    updateCard: (cardId: string, title?: string, description?: string) =>
        axios.patch<Card>(`/cards/${cardId}`, { title, description }),

    deleteCard: (cardId: string) => axios.delete(`/cards/${cardId}`),

    moveCard: (cardId: string, status: CardStatus, order: number) =>
        axios.patch<Card>(`/cards/${cardId}/move`, null, {
            params: { status, order },
        }),
};
