import type { Card, CardStatus } from '@/types/card';
import css from './Column.module.css';
import CardItem from '../CardItem/CardItem';
import { FiPlus } from 'react-icons/fi';
import { Droppable } from '@hello-pangea/dnd';

interface Props {
    status: CardStatus;
    title: string;
    cards: Card[];

    onDeleteCard?: (cardId: string) => void;

    onUpdateCard?: (
        cardId: string,
        title: string,
        description?: string
    ) => void;

    onAddCard?: () => void;
}

export default function Column({
    status,
    title,
    cards,
    onDeleteCard,
    onUpdateCard,
    onAddCard,
}: Props) {
    return (
        <div className={css.column}>
            <h3>{title}</h3>

            <Droppable droppableId={status}>
                {(provided) => (
                    <div
                        className={css.cardsContainer}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {cards.map((card, index) => (
                            <CardItem
                                key={card._id}
                                card={card}
                                index={index}
                                onDelete={onDeleteCard}
                                onUpdate={onUpdateCard}
                            />
                        ))}

                        {provided.placeholder}

                        {status === 'todo' && (
                            <div
                                className={css.addCard}
                                onClick={() => onAddCard?.()}
                            >
                                <FiPlus />
                            </div>
                        )}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
