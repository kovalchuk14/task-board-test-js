import type { Board } from './board';
import type { Card } from './card';

export interface BoardWithCards {
    board: Board;
    cards: Card[];
}
