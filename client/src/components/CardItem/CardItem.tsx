import { useState, useEffect } from 'react';
import type { Card } from '@/types/card';
import css from './CardItem.module.css';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { GiConfirmed } from 'react-icons/gi';
import { Draggable } from '@hello-pangea/dnd';

interface CardProps {
    card: Card;
    index: number;
    onDelete?: (id: string) => void;
    onUpdate?: (cardId: string, title: string, description?: string) => void;
}

export default function CardItem({
    card,
    onDelete,
    onUpdate,
    index,
}: CardProps) {
    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || '');

    useEffect(() => {
        setTitle(card.title);
        setDescription(card.description || '');
    }, [card.title, card.description]);

    const handleEditToggle = () => {
        if (isEditing) {
            onUpdate?.(card._id, title, description);
        }
        setIsEditing(!isEditing);
    };

    const handleDelete = () => {
        onDelete?.(card._id);
    };

    return (
        <Draggable draggableId={card._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${css.card} ${
                        snapshot.isDragging ? css.dragging : ''
                    }`}
                >
                    {isEditing ? (
                        <>
                            <input
                                className={css.input}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                            />
                            <textarea
                                className={css.textarea}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </>
                    ) : (
                        <>
                            <h4 className={css.title}>{card.title}</h4>
                            <p className={css.description}>
                                {card.description || 'Description...'}
                            </p>
                        </>
                    )}

                    <div className={css.actions}>
                        <button
                            onClick={handleEditToggle}
                            title={isEditing ? 'Save' : 'Edit'}
                        >
                            {isEditing ? <GiConfirmed /> : <FaRegEdit />}
                        </button>
                        <button onClick={handleDelete} title="Delete">
                            <RiDeleteBinLine />
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
