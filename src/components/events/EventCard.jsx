import React from 'react';
import './EventCard.css';
import * as Icons from '@phosphor-icons/react';
import { useTodo } from '../../store/TodoContext';

export default function EventCard({ event, top, height, onDragStart }) {
    const { setDetailEvent } = useTodo();
    const IconComponent = event.icon ? Icons[event.icon] : null;

    const handleClick = (e) => {
        e.stopPropagation();
        setDetailEvent(event);
    };

    return (
        <div
            className={`event-card ${event.color} ${event.completed ? 'completed' : ''}`}
            style={{ top: `${top}px`, height: `${height}px` }}
            onClick={handleClick}
            draggable
            onDragStart={(e) => onDragStart && onDragStart(e, event)}
            title="Click to view · Drag to reschedule"
        >
            {event.tag && (
                <div
                    className="event-tag"
                    style={{ backgroundColor: `var(--tag-${event.tagColor || 'pink'})` }}
                >
                    {event.tag}
                </div>
            )}

            {IconComponent && (
                <div className="event-icon" style={{ color: event.iconColor || '#333' }}>
                    <IconComponent size={16} weight="bold" />
                </div>
            )}

            <div className="event-title">{event.title}</div>
            {height > 70 && <div className="event-loc">{event.loc}</div>}

            {event.hasJoinDark && height > 100 && (
                <button 
                    className="join-btn dark" 
                    style={{ marginTop: 'auto' }} 
                    onClick={(e) => {
                        e.stopPropagation();
                        setDetailEvent(event);
                    }}
                >
                    Open
                </button>
            )}

            {height >= 60 && (
                <div className="event-time" style={{ marginTop: 'auto' }}>
                    {event.start} - {event.end}
                </div>
            )}
        </div>
    );
}
