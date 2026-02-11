import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
} from '@reduxjs/toolkit';
import { boardsAPI } from './boardsAPI';
import type { Board } from '@/types/board';

interface BoardsState {
    currentBoard?: Board;
    loading: boolean;
    error?: string;
}

const initialState: BoardsState = {
    currentBoard: undefined,
    loading: false,
};

export const fetchBoardById = createAsyncThunk(
    'boards/fetchBoardById',
    async (boardId: string) => {
        const res = await boardsAPI.getBoardById(boardId);
        console.log(res.data);
        return res.data;
    }
);

export const createBoard = createAsyncThunk(
    'boards/createBoard',
    async (name?: string) => {
        const res = await boardsAPI.createBoard(name);
        return res.data;
    }
);

export const updateBoard = createAsyncThunk(
    'boards/updateBoard',
    async ({ boardId, name }: { boardId: string; name: string }) => {
        const res = await boardsAPI.updateBoard(boardId, name);
        return res.data;
    }
);

export const deleteBoard = createAsyncThunk(
    'boards/deleteBoard',
    async (boardId: string) => {
        await boardsAPI.deleteBoard(boardId);
        return boardId;
    }
);

export const boardsSlice = createSlice({
    name: 'boards',
    initialState,
    reducers: {
        setCurrentBoard(state, action: PayloadAction<Board | undefined>) {
            state.currentBoard = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBoardById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBoardById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBoard = action.payload.board;
            })
            .addCase(fetchBoardById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createBoard.fulfilled, (state, action) => {
                state.currentBoard = action.payload;
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                if (state.currentBoard?._id === action.payload._id)
                    state.currentBoard = action.payload;
            })
            .addCase(deleteBoard.fulfilled, (state, action) => {
                if (state.currentBoard?._id === action.payload)
                    state.currentBoard = undefined;
            });
    },
});

export const { setCurrentBoard } = boardsSlice.actions;
export default boardsSlice.reducer;
