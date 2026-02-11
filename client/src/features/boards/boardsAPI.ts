import axios from '@/services/api';
import type { Board } from '@/types/board';
import type { BoardWithCards } from '@/types/boardWithCards';

export const boardsAPI = {
    createBoard: (name?: string) => axios.post<Board>('/boards', { name }),

    getBoardById: (boardId: string) =>
        axios.get<BoardWithCards>(`/boards/${boardId}`),

    updateBoard: (boardId: string, name: string) =>
        axios.patch<Board>(`/boards/${boardId}`, { name }),

    deleteBoard: (boardId: string) => axios.delete(`/boards/${boardId}`),
};
