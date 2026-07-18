import React from 'react';
import './HeaderArea.css';
import { CaretDown, ArrowsClockwise, X } from '@phosphor-icons/react';

const FILTER_LABELS = {
    housing: '🏠 Housing Search',
    projects: '💻 Projects',
    music: '🎵 Music & Events',
    career: '💼 Career & Admin',
    finance: '💰 Finances & Study',
};

export default function HeaderArea({ onAddClick, onRefresh, activeFilter }) {
    return (
        <div className="header-area">
            <div className="header-left">
                <h1>
                    {activeFilter ? FILTER_LABELS[activeFilter] || 'Filtered' : 'Stay on track.'}
                </h1>
                {activeFilter ? (
                    <button className="date-picker-btn" onClick={onRefresh} style={{ background: 'var(--sidebar-active)', color: 'white' }}>
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
                    <button className="toggle-btn">Today</button>
                    <button className="toggle-btn active">Week</button>
                    <button className="toggle-btn">Month</button>
                </div>
            </div>
        </div>
    );
}
