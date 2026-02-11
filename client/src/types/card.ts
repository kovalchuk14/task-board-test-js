export type CardStatus = 'todo' | 'in_progress' | 'done';
export interface Card {
    _id: string;
    boardId: string;
    title: string;
    description?: string;
    status: CardStatus;
    order: number;
    createdAt: string;
    updatedAt: string;
}
