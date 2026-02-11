import { useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { createBoard } from '@/features/boards/boardsSlice';
import css from './BoardPage.module.css';

interface BoardHeaderProps {
    setBoardId: (id: string) => void;
}

export default function BoardHeader({ setBoardId }: BoardHeaderProps) {
    const dispatch = useAppDispatch();
    const [newBoardName, setNewBoardName] = useState('');
    const [id, setId] = useState('');
    const handleCreateBoard = () => {
        if (!newBoardName.trim()) return;

        dispatch(createBoard(newBoardName))
            .unwrap()
            .then((board) => {
                setBoardId(board._id);
                setNewBoardName('');
            });
    };

    return (
        <div className={css.pink}>
            <div className={css.searchContainer}>
                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter a board ID here..."
                    className={css.input}
                />
                <button onClick={() => setBoardId(id)} className={css.button}>
                    Load
                </button>
            </div>

            <div className={css.searchContainer}>
                <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="Enter new board name"
                    className={css.input}
                />
                <button onClick={handleCreateBoard} className={css.button}>
                    Create
                </button>
            </div>
        </div>
    );
}
