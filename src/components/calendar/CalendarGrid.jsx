import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CalendarGrid.css';
import EventCard from '../events/EventCard';
import { useTodo } from '../../store/TodoContext';
import {
    START_HOUR, END_HOUR, ROW_HEIGHT, PIXELS_PER_MIN,
    calcTop, calcHeight, timeFromPixels, addMinutes, getDurationMinutes,
    getMonday, getWeekDays, DAY_NAMES_SHORT, formatDateLabel, isSameDay
} from '../../utils/timeUtils';

export default function CalendarGrid() {
    const { events, updateEvent, calendarView } = useTodo();
    const [currentTimeData, setCurrentTimeData] = useState({ top: 0, label: '', visible: false });
    const [dragState, setDragState] = useState(null); // { eventId, originDay, startY, originalTop }
    const [selectedDay, setSelectedDay] = useState(new Date());
    const gridRef = useRef(null);

    // Real date-aware week
    const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
    let weekDays = getWeekDays(weekStart);
    const today = new Date();
    
    if (calendarView === 'day') {
        weekDays = [selectedDay];
    }

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            if (h >= START_HOUR && h <= END_HOUR) {
                const totalMins = (h - START_HOUR) * 60 + m;
                setCurrentTimeData({
                    top: totalMins * PIXELS_PER_MIN,
                    label: `${h}:${m < 10 ? '0' + m : m}`,
                    visible: true
                });
            } else {
                setCurrentTimeData(prev => ({ ...prev, visible: false }));
            }
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleNav = (e) => {
            if (e.detail === 'prev') {
                if (calendarView === 'day') {
                    setSelectedDay(prev => { const d = new Date(prev); d.setDate(d.getDate() - 1); return d; });
                } else {
                    setWeekStart(prev => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; });
                }
            } else if (e.detail === 'next') {
                if (calendarView === 'day') {
                    setSelectedDay(next => { const d = new Date(next); d.setDate(d.getDate() + 1); return d; });
                } else {
                    setWeekStart(next => { const d = new Date(next); d.setDate(d.getDate() + 7); return d; });
                }
            }
        };
        window.addEventListener('calendarNav', handleNav);
        return () => window.removeEventListener('calendarNav', handleNav);
    }, [calendarView]);

    // --- Drag & Drop ---
    const handleDragStart = useCallback((e, event) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(event.id));
        setDragState({ eventId: event.id, originDay: event.day });
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((e, targetDay) => {
        e.preventDefault();
        const eventId = parseInt(e.dataTransfer.getData('text/plain'));
        const droppedEvent = events.find(ev => ev.id === eventId);
        if (!droppedEvent) return;

        // Calculate new time from Y position
        const gridRect = gridRef.current.getBoundingClientRect();
        const relativeY = e.clientY - gridRect.top + gridRef.current.scrollTop;
        const newStart = timeFromPixels(relativeY);
        const duration = getDurationMinutes(droppedEvent.start, droppedEvent.end);
        const newEnd = addMinutes(newStart, duration);

        updateEvent({
            ...droppedEvent,
            day: targetDay,
            start: newStart,
            end: newEnd
        });

        setDragState(null);
    }, [events, updateEvent]);

    const totalHours = END_HOUR - START_HOUR + 1;
    const hoursArray = Array.from({ length: totalHours }, (_, i) => START_HOUR + i);

    return (
        <div className="calendar-container">
            {/* Week Navigation */}
            <div className="week-nav">
                <button className="week-nav-btn" onClick={() => {
                    if (calendarView === 'day') {
                        const prev = new Date(selectedDay);
                        prev.setDate(prev.getDate() - 1);
                        setSelectedDay(prev);
                    } else {
                        const prev = new Date(weekStart);
                        prev.setDate(prev.getDate() - 7);
                        setWeekStart(prev);
                    }
                }}>‹</button>
                <span className="week-nav-label">
                    {calendarView === 'day' ? 
                        selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) 
                        : 
                        `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${
                            new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        }`
                    }
                </span>
                <button className="week-nav-btn" onClick={() => {
                    if (calendarView === 'day') {
                        const next = new Date(selectedDay);
                        next.setDate(next.getDate() + 1);
                        setSelectedDay(next);
                    } else {
                        const next = new Date(weekStart);
                        next.setDate(next.getDate() + 7);
                        setWeekStart(next);
                    }
                }}>›</button>
                <button className="week-nav-today" onClick={() => {
                    if (calendarView === 'day') setSelectedDay(new Date());
                    else setWeekStart(getMonday(new Date()));
                }}>
                    Today
                </button>
            </div>

            <div className="calendar-header">
                {weekDays.map((date, idx) => {
                    const isToday = isSameDay(date, today);
                    const realDayIndex = date.getDay() === 0 ? 7 : date.getDay(); // 1-7
                    return (
                        <div key={idx} className={`day-col-header ${isToday ? 'active' : ''}`} style={realDayIndex === 7 ? { opacity: 0.4 } : {}}>
                            <span className="day-name">{DAY_NAMES_SHORT[realDayIndex - 1]?.charAt(0) || date.toLocaleDateString('en-US', {weekday: 'short'})}</span>
                            <span className="day-date">{date.toLocaleDateString('en-US', {weekday: 'short'})} {formatDateLabel(date)}</span>
                        </div>
                    );
                })}
            </div>

            <div className="calendar-grid" ref={gridRef}>
                <div className="time-col">
                    {hoursArray.map(h => (
                        <div key={h} className="time-slot">{h < 10 ? `0${h}:00` : `${h}:00`}</div>
                    ))}
                </div>

                <div className="grid-lines-container">
                    {hoursArray.map((_, i) => (
                        <div key={i} className="grid-line-hour" style={{ top: i * ROW_HEIGHT }}></div>
                    ))}
                    <div className="grid-line-col-container">
                        {weekDays.map((_, i) => <div key={i} className="grid-line-col"></div>)}
                    </div>
                </div>

                {currentTimeData.visible && (
                    <div className="current-time-line" style={{ top: currentTimeData.top }}>
                        <span className="current-time-label">{currentTimeData.label}</span>
                    </div>
                )}

                <div className="days-container">
                    {weekDays.map((date, idx) => {
                        const realDayIndex = date.getDay() === 0 ? 7 : date.getDay(); // 1-7 for matching events
                        const dayEvents = events.filter(e => e.day === realDayIndex);
                        return (
                            <div
                                key={idx}
                                className={`day-col ${dragState ? 'drag-active' : ''}`}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, realDayIndex)}
                            >
                                {dayEvents.map(event => {
                                    const top = calcTop(event.start);
                                    if (top < 0) return null;
                                    const height = calcHeight(event.start, event.end);
                                    return (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            top={top}
                                            height={height}
                                            onDragStart={handleDragStart}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
