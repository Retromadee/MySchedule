import React from 'react';
import './EventCard.css';
import { BookOpen, Broom, CalendarStar, CheckCircle, Code, House, VideoCamera, Wallet } from '@phosphor-icons/react';
import { useTodo } from '../../store/TodoContext';

export default function EventCard({ event, top, height, onDragStart }) {
    const { setDetailEvent } = useTodo();
    const iconMap = { BookOpen, Broom, CalendarStar, Code, House, VideoCamera, Wallet };
    const IconComponent = iconMap[event.icon];

    const handleClick = (e) => {
        e.stopPropagation();
        setDetailEvent(event);
    };

    let priorityColor = '';
    if (event.priority === 'high') priorityColor = '🔴';
    else if (event.priority === 'medium') priorityColor = '🟡';
    else if (event.priority === 'low') priorityColor = '🟢';

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

            <div className="event-title">
                {event.completed ? <CheckCircle size={14} weight="fill" style={{ marginRight: '4px', verticalAlign: 'middle' }} /> : null}
                {event.title}
                {priorityColor && <span style={{ marginLeft: '4px', fontSize: '10px' }}>{priorityColor}</span>}
            </div>
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
