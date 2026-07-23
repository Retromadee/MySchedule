import React from 'react';
import './HeaderArea.css';
import { CaretDown, ArrowsClockwise, X, Funnel } from '@phosphor-icons/react';
import { useTodo } from '../../store/TodoContext';

const FILTER_LABELS = {
    housing: '🏠 Housing Search',
    projects: '💻 Projects',
    music: '🎵 Music & Events',
    career: '💼 Career & Admin',
    finance: '💰 Finances & Study',
};

export default function HeaderArea({ onAddClick, onRefresh, activeFilter, onClearFilter }) {
    const { calendarView, setCalendarView, priorityFilter, setPriorityFilter, statusFilter, setStatusFilter } = useTodo();
    
    return (
        <div className="header-area">
            <div className="header-left">
                <h1>
                    {activeFilter ? FILTER_LABELS[activeFilter] || 'Filtered' : 'Stay on track.'}
                </h1>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {activeFilter && (
                        <button className="date-picker-btn" onClick={onClearFilter} style={{ background: 'var(--sidebar-active)', color: 'white' }}>
                            <X size={14} weight="bold" /> Clear Filter
                        </button>
                    )}
                    
                    {/* Priority Filter */}
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="date-picker-btn"
                        style={{ border: '1px solid var(--border-color, #e2e8f0)', cursor: 'pointer', outline: 'none' }}
                    >
                        <option value="all">⚡ Priority: All</option>
                        <option value="high">🔴 High</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="low">🟢 Low</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="date-picker-btn"
                        style={{ border: '1px solid var(--border-color, #e2e8f0)', cursor: 'pointer', outline: 'none' }}
                    >
                        <option value="all">📋 Status: All</option>
                        <option value="pending">⏳ Pending</option>
                        <option value="completed">✅ Completed</option>
                    </select>
                </div>
            </div>
            <div className="header-right">
                <button className="add-event-btn" onClick={onAddClick}>Add Task</button>
                <div className="header-icons">
                    <button className="icon-btn" onClick={onRefresh} title="Refresh tasks">
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
