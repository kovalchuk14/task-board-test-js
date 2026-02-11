import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
} from '@reduxjs/toolkit';
import { cardsAPI } from './cardsAPI';
import type { Card, CardStatus } from '@/types/card';

interface CardsState {
    list: Card[];
    loading: boolean;
    error?: string;
}

const initialState: CardsState = {
    list: [],
    loading: false,
};

export const createCard = createAsyncThunk(
    'cards/createCard',
    async ({ boardId, title }: { boardId: string; title: string }) => {
        const res = await cardsAPI.createCard(boardId, title);
        return res.data;
    }
);

export const updateCard = createAsyncThunk(
    'cards/updateCard',
    async ({
        cardId,
        title,
        description,
    }: {
        cardId: string;
        title: string;
        description?: string;
    }) => {
        const res = await cardsAPI.updateCard(cardId, title, description);
        return res.data;
    }
);

export const deleteCard = createAsyncThunk(
    'cards/deleteCard',
    async (cardId: string) => {
        await cardsAPI.deleteCard(cardId);
        return cardId;
    }
);

export const moveCard = createAsyncThunk(
    'cards/moveCard',
    async ({
        cardId,
        status,
        order,
    }: {
        cardId: string;
        status: CardStatus;
        order: number;
    }) => {
        const res = await cardsAPI.moveCard(cardId, status, order);
        return res.data;
    }
);

export const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        setCards(state, action: PayloadAction<Card[]>) {
            state.list = action.payload;
        },

        optimisticMoveCard(
            state,
            action: PayloadAction<{
                id: string;
                status: CardStatus;
                order: number;
            }>
        ) {
            const card = state.list.find((c) => c._id === action.payload.id);
            if (card) {
                card.status = action.payload.status;
                card.order = action.payload.order;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // createCard
            .addCase(createCard.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            // updateCard
            .addCase(updateCard.fulfilled, (state, action) => {
                const index = state.list.findIndex(
                    (c) => c._id === action.payload._id
                );
                if (index !== -1) state.list[index] = action.payload;
            })
            // deleteCard
            .addCase(deleteCard.fulfilled, (state, action) => {
                state.list = state.list.filter((c) => c._id !== action.payload);
            })
            // moveCard
            .addCase(moveCard.fulfilled, (state, action) => {
                const index = state.list.findIndex(
                    (c) => c._id === action.payload._id
                );
                if (index !== -1) state.list[index] = action.payload;
            });
    },
});

export const { optimisticMoveCard, setCards } = cardsSlice.actions;
export default cardsSlice.reducer;
