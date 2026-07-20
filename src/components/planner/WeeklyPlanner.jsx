import React, { useState, useRef, useCallback } from 'react';
import './WeeklyPlanner.css';
import { useTodo } from '../../store/TodoContext';
import { getMonday, getWeekDays, isSameDay } from '../../utils/timeUtils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function formatDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getChipClass(event) {
    const cat = event.category;
    if (cat === 'housing') return 'chip-housing';
    if (cat === 'projects') return 'chip-projects';
    if (cat === 'music') return 'chip-music';
    if (cat === 'career') return 'chip-career';
    if (cat === 'finance') return 'chip-finance';
    const col = event.color;
    if (col === 'blue') return 'chip-blue';
    if (col === 'grey') return 'chip-grey';
    if (col === 'yellow') return 'chip-yellow';
    return 'chip-white';
}

function getChipLabel(event) {
    const map = {
        housing: 'Housing',
        projects: 'Projects',
        music: 'Music',
        career: 'Career',
        finance: 'Finance',
    };
    return map[event.category] || event.tag || event.category || '';
}

// ─── Circular Progress Ring ────────────────────────────────────────────────────

function ProgressRing({ percent, isToday, allDone }) {
    const r = 22;
    const circ = 2 * Math.PI * r;
    const offset = circ - (percent / 100) * circ;
    const strokeColor = allDone ? '#22c55e' : isToday ? '#f17c8d' : '#f17c8d';

    return (
        <div className="planner-ring">
            <svg width="52" height="52" viewBox="0 0 52 52">
                <circle className="planner-ring-bg" cx="26" cy="26" r={r} />
                <circle
                    className="planner-ring-fill"
                    cx="26" cy="26" r={r}
                    stroke={strokeColor}
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="planner-ring-text">{Math.round(percent)}%</div>
        </div>
    );
}

// ─── Task Checkbox Item ────────────────────────────────────────────────────────

function TaskItem({ event, onToggle }) {
    return (
        <div
            className={`planner-task-item ${event.completed ? 'completed' : ''}`}
            onClick={() => onToggle(event.id)}
        >
            <div className={`planner-checkbox ${event.completed ? 'checked' : ''}`}>
                <div className="planner-checkbox-tick" />
            </div>
            <div className="planner-task-info">
                <div className="planner-task-title">{event.title}</div>
                <div className="planner-task-meta">{event.start} – {event.end} • {event.loc}</div>
            </div>
            {getChipLabel(event) && (
                <span className={`planner-task-chip ${getChipClass(event)}`}>
                    {getChipLabel(event)}
                </span>
            )}
        </div>
    );
}

// ─── Single Day Card ───────────────────────────────────────────────────────────

function DayCard({ date, dayIndex, events, isToday, onToggle, cardRef }) {
    const completed = events.filter(e => e.completed).length;
    const total = events.length;
    const percent = total === 0 ? 0 : (completed / total) * 100;
    const allDone = total > 0 && completed === total;

    const dayName = DAY_NAMES[dayIndex - 1] || date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const sorted = [...events].sort((a, b) => a.start.localeCompare(b.start));

    return (
        <div
            ref={cardRef}
            className={`planner-day-card ${isToday ? 'today-card' : ''} ${allDone ? 'all-done-card' : ''}`}
        >
            {/* Header */}
            <div className={`planner-card-header ${isToday ? 'today-header' : ''}`}>
                <div className="planner-card-header-left">
                    <span className="planner-card-day-name">
                        {isToday ? '📍 Today — ' : ''}{dayName}
                    </span>
                    <span className="planner-card-day-date">{dateLabel}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {total === 0 ? 'No tasks' : `${completed} of ${total} done`}
                    </span>
                </div>
                <ProgressRing percent={percent} isToday={isToday} allDone={allDone} />
            </div>

            {/* Thin progress bar */}
            <div className="planner-card-progress-bar">
                <div className="planner-card-progress-fill" style={{ width: `${percent}%` }} />
            </div>

            {/* Task list */}
            <div className="planner-task-list">
                {sorted.length === 0 ? (
                    <div className="planner-empty">
                        <span className="planner-empty-icon">🌿</span>
                        <span>Rest day — no tasks scheduled</span>
                    </div>
                ) : (
                    sorted.map(event => (
                        <TaskItem key={event.id} event={event} onToggle={onToggle} />
                    ))
                )}
            </div>
        </div>
    );
}

// ─── Main Weekly Planner ───────────────────────────────────────────────────────

export default function WeeklyPlanner() {
    const { events, toggleEventCompletion } = useTodo();
    const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
    const today = new Date();
    const weekDays = getWeekDays(weekStart);
    const dayCardRefs = useRef([]);

    // Build per-day stats — supports date-specific and recurring weekday events
    const dayStats = weekDays.map((date, i) => {
        const dayIndex = date.getDay() === 0 ? 7 : date.getDay();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        const dayEvents = events.filter(e =>
            e.date ? e.date === formattedDate : e.day === dayIndex
        );
        const completed = dayEvents.filter(e => e.completed).length;
        const total = dayEvents.length;
        const percent = total === 0 ? 0 : (completed / total) * 100;
        const isToday = isSameDay(date, today);
        const allDone = total > 0 && completed === total;
        return { date, dayIndex, dayEvents, completed, total, percent, isToday, allDone };
    });

    // Week-level overall progress
    const totalAll = dayStats.reduce((s, d) => s + d.total, 0);
    const completedAll = dayStats.reduce((s, d) => s + d.completed, 0);
    const weekPercent = totalAll === 0 ? 0 : Math.round((completedAll / totalAll) * 100);

    const scrollToDay = useCallback((i) => {
        dayCardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    const prevWeek = () => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() - 7);
        setWeekStart(d);
    };
    const nextWeek = () => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + 7);
        setWeekStart(d);
    };
    const goToday = () => setWeekStart(getMonday(new Date()));

    const weekRangeLabel = `${formatDate(weekDays[0])} — ${formatDate(weekDays[6])}`;

    return (
        <div className="planner-wrapper">

            {/* ── Week Navigation ─────────────────────────── */}
            <div className="planner-week-nav">
                <button className="planner-week-nav-btn" onClick={prevWeek}>‹</button>
                <span className="planner-week-label">
                    📅 Week of {weekRangeLabel}
                </span>
                <button className="planner-week-nav-btn" onClick={nextWeek}>›</button>
                <button className="planner-week-today-btn" onClick={goToday}>Today</button>
                <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                    {completedAll}/{totalAll} tasks done
                    <span style={{
                        marginLeft: '10px',
                        fontWeight: '700',
                        color: weekPercent === 100 ? '#22c55e' : 'var(--text-main)'
                    }}>{weekPercent}%</span>
                </span>
            </div>

            {/* ── Week Progress Map ────────────────────────── */}
            <div className="planner-progress-map">
                {dayStats.map((d, i) => (
                    <div
                        key={i}
                        className={`planner-day-tile ${d.isToday ? 'today' : ''} ${d.allDone ? 'all-done' : ''}`}
                        onClick={() => scrollToDay(i)}
                        title={`${DAY_NAMES[i]}: ${d.completed}/${d.total} tasks`}
                    >
                        <span className="planner-tile-day">{DAY_LETTERS[i]}</span>
                        <span className="planner-tile-date">
                            {d.date.toLocaleDateString('en-US', { day: 'numeric' })}
                        </span>
                        <span className="planner-tile-count">
                            {d.total === 0 ? 'free' : `${d.completed}/${d.total}`}
                        </span>
                        <div className="planner-tile-bar-track">
                            <div
                                className="planner-tile-bar-fill"
                                style={{ width: `${d.percent}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Day Cards Grid ───────────────────────────── */}
            <div className="planner-days-grid">
                {dayStats.map((d, i) => (
                    <DayCard
                        key={i}
                        date={d.date}
                        dayIndex={d.dayIndex}
                        events={d.dayEvents}
                        isToday={d.isToday}
                        onToggle={toggleEventCompletion}
                        cardRef={el => (dayCardRefs.current[i] = el)}
                    />
                ))}
            </div>
        </div>
    );
}
