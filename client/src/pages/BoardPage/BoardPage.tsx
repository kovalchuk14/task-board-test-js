import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

import {
    fetchBoardById,
    setCurrentBoard,
    updateBoard,
    deleteBoard,
} from '@/features/boards/boardsSlice';
import {
    createCard,
    deleteCard,
    moveCard,
    optimisticMoveCard,
    setCards,
    updateCard,
} from '@/features/cards/cardsSlice';

import BoardHeader from './BoardHeader';
import Column from '@/components/Column/Column';

import { groupCardsByStatus } from '@/utils/groupCardsByStatus';
import { sortByOrder } from '@/utils/sortByOrder';

import css from './BoardPage.module.css';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { GiConfirmed } from 'react-icons/gi';

import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import type { CardStatus } from '@/types/card';

export default function BoardPage() {
    const dispatch = useAppDispatch();

    const board = useAppSelector((s) => s.boards.currentBoard);
    const cards = useAppSelector((s) => s.cards.list);
    const loading = useAppSelector((s) => s.boards.loading);

    const [boardId, setBoardId] = useState<string>('');
    const [isEditingBoard, setIsEditingBoard] = useState(false);
    const [boardName, setBoardName] = useState('');

    useEffect(() => {
        if (!boardId) return;

        dispatch(fetchBoardById(boardId))
            .unwrap()
            .then((data) => {
                dispatch(setCurrentBoard(data.board));
                dispatch(setCards(data.cards));
            })
            .catch(() => {
                dispatch(setCurrentBoard(undefined));
                dispatch(setCards([]));
            });
    }, [boardId, dispatch]);

    useEffect(() => {
        if (board) setBoardName(board.name);
    }, [board]);

    const handleBoardEditToggle = () => {
        if (!board) return;

        if (isEditingBoard) {
            dispatch(
                updateBoard({
                    boardId: board._id,
                    name: boardName,
                })
            );
        }

        setIsEditingBoard(!isEditingBoard);
    };

    const handleBoardDelete = () => {
        if (!board) return;

        if (!confirm('Delete this board?')) return;

        dispatch(deleteBoard(board._id));
        setBoardId('');
        dispatch(setCards([]));
    };

    const grouped = groupCardsByStatus(cards);

    const handleAddCard = () => {
        if (!boardId) return;

        dispatch(createCard({ boardId, title: 'New card' }));
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;
        const newStatus = destination.droppableId as CardStatus;

        const sourceCards = cards
            .filter((c) => c.status === source.droppableId)
            .sort((a, b) => a.order - b.order);

        const destCards =
            source.droppableId === destination.droppableId
                ? [...sourceCards]
                : cards
                      .filter((c) => c.status === destination.droppableId)
                      .sort((a, b) => a.order - b.order);

        const movedCardIndex = sourceCards.findIndex(
            (c) => c._id === draggableId
        );
        const movedCard = { ...sourceCards[movedCardIndex] };
        sourceCards.splice(movedCardIndex, 1);

        destCards.splice(destination.index, 0, movedCard);

        movedCard.status = newStatus;

        const updatedCards = destCards.map((c, idx) => ({
            _id: c._id,
            status: c.status,
            order: idx,
        }));

        updatedCards.forEach((c) => {
            console.log('Sending move:', c);
            dispatch(
                optimisticMoveCard({
                    id: c._id,
                    status: c.status,
                    order: c.order,
                })
            );
        });

        updatedCards.forEach((c) =>
            dispatch(
                moveCard({ cardId: c._id, status: c.status, order: c.order })
            )
        );
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={css.aqua}>
                <BoardHeader setBoardId={setBoardId} />

                {loading && <p>Loading...</p>}

                {board && (
                    <div className={css.boardInfoContainer}>
                        <div>
                            {isEditingBoard ? (
                                <input
                                    value={boardName}
                                    onChange={(e) =>
                                        setBoardName(e.target.value)
                                    }
                                />
                            ) : (
                                <span>{board.name}</span>
                            )}
                        </div>
                        <div>id: {boardId}</div>
                        <div className={css.actions}>
                            <button onClick={handleBoardEditToggle}>
                                {isEditingBoard ? (
                                    <GiConfirmed />
                                ) : (
                                    <FaRegEdit />
                                )}
                            </button>
                            <button onClick={handleBoardDelete}>
                                <RiDeleteBinLine />
                            </button>
                        </div>
                    </div>
                )}

                {board ? (
                    <div className={css.columnsContainer}>
                        {(['todo', 'in_progress', 'done'] as CardStatus[]).map(
                            (status) => (
                                <Column
                                    key={status}
                                    status={status}
                                    title={
                                        status === 'todo'
                                            ? 'To Do'
                                            : status === 'in_progress'
                                              ? 'In Progress'
                                              : 'Done'
                                    }
                                    cards={sortByOrder(grouped[status])}
                                    onDeleteCard={(cardId) =>
                                        dispatch(deleteCard(cardId))
                                    }
                                    onUpdateCard={(
                                        cardId,
                                        title,
                                        description
                                    ) =>
                                        dispatch(
                                            updateCard({
                                                cardId,
                                                title,
                                                description,
                                            })
                                        )
                                    }
                                    onAddCard={
                                        status === 'todo'
                                            ? handleAddCard
                                            : undefined
                                    }
                                />
                            )
                        )}
                    </div>
                ) : (
                    boardId && !loading && <p>Board not found</p>
                )}
            </div>
        </DragDropContext>
    );
}
