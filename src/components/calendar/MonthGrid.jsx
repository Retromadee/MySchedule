import React, { useState, useMemo, useCallback } from 'react';
import { useTodo } from '../../store/TodoContext';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import './MonthGrid.css';
import { eventsForDate } from '../../utils/eventUtils';

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CATEGORY_COLORS = {
    housing: '#b3c9fb',
    projects: '#e8e6dd',
    music: '#f8db66',
    career: '#ffa4da',
    finance: '#bbf7d0',
};

function buildMonthGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    // Monday=0 offset
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    const cells = [];
    for (let i = 0; i < totalCells; i++) {
        const dayNum = i - startOffset + 1;
        if (dayNum < 1 || dayNum > daysInMonth) {
            cells.push(null);
        } else {
            cells.push(new Date(year, month, dayNum));
        }
    }
    return cells;
}

const MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
];

export default function MonthGrid() {
    const { events, setDetailEvent, openAddModal } = useTodo();
    const today = new Date();

    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(null);

    const cells = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

    // Map events: day index 1-7 (Mon-Sun) → events per real date
    // Since events use day:1-7 for the current week, we show them on matching weekday
    const getCellEvents = useCallback((date) => {
        if (!date) return [];
        return eventsForDate(events, date);
    }, [events]);

    function getWeekday(date) {
        // Returns 1-7 (Mon=1, Sun=7)
        const d = date.getDay();
        return d === 0 ? 7 : d;
    }

    function prevMonth() {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    }
    function nextMonth() {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    }
    function goToday() {
        setViewYear(today.getFullYear());
        setViewMonth(today.getMonth());
    }

    React.useEffect(() => {
        const handleNav = (e) => {
            if (e.detail === 'prev') {
                if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
                else setViewMonth(m => m - 1);
            }
            if (e.detail === 'next') {
                if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
                else setViewMonth(m => m + 1);
            }
        };
        window.addEventListener('calendarNav', handleNav);
        return () => window.removeEventListener('calendarNav', handleNav);
    }, [viewMonth, viewYear]);

    const isToday = (date) => date &&
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

    const isSelected = (date) => date && selectedDate &&
        date.toDateString() === selectedDate.toDateString();

    return (
        <div className="month-grid-wrapper">
            {/* Header */}
            <div className="month-nav">
                <button className="month-nav-btn" onClick={prevMonth}><CaretLeft size={16} weight="bold" /></button>
                <div className="month-nav-center">
                    <span className="month-nav-title">{MONTH_NAMES[viewMonth]} {viewYear}</span>
                    <button className="month-today-btn" onClick={goToday}>Today</button>
                </div>
                <button className="month-nav-btn" onClick={nextMonth}><CaretRight size={16} weight="bold" /></button>
            </div>

            {/* Day Headers */}
            <div className="month-day-headers">
                {DAY_HEADERS.map(d => (
                    <div key={d} className="month-day-header">{d}</div>
                ))}
            </div>

            {/* Grid */}
            <div className="month-grid">
                {cells.map((date, i) => {
                    const wd = date ? getWeekday(date) : null;
                    const dayEvents = getCellEvents(date);
                    const today_ = isToday(date);
                    const selected_ = isSelected(date);
                    const isWeekend = wd === 6 || wd === 7;

                    return (
                        <div
                            key={i}
                            className={`month-cell ${!date ? 'empty' : ''} ${today_ ? 'today' : ''} ${selected_ ? 'selected' : ''} ${isWeekend && date ? 'weekend' : ''}`}
                            onClick={() => date && setSelectedDate(date)}
                        >
                            {date && (
                                <>
                                    <div className="month-cell-date">
                                        <span className={`month-date-num ${today_ ? 'today-circle' : ''}`}>
                                            {date.getDate()}
                                        </span>
                                    </div>
                                    <div className="month-cell-events">
                                        {dayEvents.slice(0, 3).map(ev => (
                                            <div
                                                key={ev.id}
                                                className="month-event-chip"
                                                style={{ background: CATEGORY_COLORS[ev.category] || '#e8e6dd' }}
                                                onClick={(e) => { e.stopPropagation(); setDetailEvent(ev); }}
                                                title={`${ev.title} · ${ev.start}–${ev.end}`}
                                            >
                                                <span className={`month-chip-dot ${ev.completed ? 'done' : ''}`} />
                                                <span className="month-chip-text">{ev.title}</span>
                                            </div>
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <div className="month-more-badge">+{dayEvents.length - 3} more</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Selected Day Detail */}
            {selectedDate && (
                <div className="month-selected-panel">
                    <div className="month-selected-header">
                        <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        <button className="month-add-btn" onClick={openAddModal}>+ Add Task</button>
                    </div>
                    <div className="month-selected-events">
                        {getCellEvents(selectedDate).length === 0 ? (
                            <div className="month-selected-empty">No tasks on this day</div>
                        ) : (
                            getCellEvents(selectedDate).map(ev => (
                                <div key={ev.id} className="month-selected-item" onClick={() => setDetailEvent(ev)}>
                                    <span
                                        className="month-selected-dot"
                                        style={{ background: CATEGORY_COLORS[ev.category] || '#e8e6dd' }}
                                    />
                                    <div className="month-selected-info">
                                        <span className="month-selected-title" style={{ textDecoration: ev.completed ? 'line-through' : 'none', opacity: ev.completed ? 0.5 : 1 }}>{ev.title}</span>
                                        <span className="month-selected-time">{ev.start} – {ev.end}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
