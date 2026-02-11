import type { Card } from '@/types/card';

export function sortByOrder(cards: Card[]): Card[] {
    return [...cards].sort((a, b) => a.order - b.order);
}
