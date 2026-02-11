import type { Card, CardStatus } from '@/types/card';

type GroupedCards = Record<CardStatus, Card[]>;

export function groupCardsByStatus(cards: Card[]): GroupedCards {
    return {
        todo: cards.filter((c) => c.status === 'todo'),
        in_progress: cards.filter((c) => c.status === 'in_progress'),
        done: cards.filter((c) => c.status === 'done'),
    };
}
