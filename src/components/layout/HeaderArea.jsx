import React from 'react';
import './HeaderArea.css';
import { CaretDown, ArrowsClockwise, X } from '@phosphor-icons/react';
import { useTodo } from '../../store/TodoContext';

const FILTER_LABELS = {
    housing: '🏠 Housing Search',
    projects: '💻 Projects',
    music: '🎵 Music & Events',
    career: '💼 Career & Admin',
    finance: '💰 Finances & Study',
};

export default function HeaderArea({ onAddClick, onRefresh, activeFilter, onClearFilter }) {
    const { calendarView, setCalendarView } = useTodo();
    
    return (
        <div className="header-area">
            <div className="header-left">
                <h1>
                    {activeFilter ? FILTER_LABELS[activeFilter] || 'Filtered' : 'Stay on track.'}
                </h1>
                {activeFilter ? (
                    <button className="date-picker-btn" onClick={onClearFilter} style={{ background: 'var(--sidebar-active)', color: 'white' }}>
                        <X size={14} weight="bold" /> Clear Filter
                    </button>
                ) : (
                    <button className="date-picker-btn">
                        This Week <CaretDown size={14} />
                    </button>
                )}
            </div>
            <div className="header-right">
                <button className="add-event-btn" onClick={onAddClick}>Add Task</button>
                <div className="header-icons">
                    <button className="icon-btn" onClick={onRefresh}>
                        <ArrowsClockwise size={20} />
                    </button>
                </div>
                <div className="view-toggles">
                    <button 
                        className={`toggle-btn ${calendarView === 'day' ? 'active' : ''}`}
                        onClick={() => setCalendarView('day')}
                    >Day</button>
                    <button 
                        className={`toggle-btn ${calendarView === 'week' ? 'active' : ''}`}
                        onClick={() => setCalendarView('week')}
                    >Week</button>
                    <button 
                        className={`toggle-btn ${calendarView === 'month' ? 'active' : ''}`}
                        onClick={() => setCalendarView('month')}
                    >Month</button>
                </div>
            </div>
        </div>
    );
}
