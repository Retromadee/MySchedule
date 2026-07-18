import React, { useMemo } from 'react';
import { useTodo } from '../../store/TodoContext';
import { CheckCircle, Circle, Fire, ChartPieSlice, CalendarCheck, Trophy } from '@phosphor-icons/react';
import './Dashboard.css';

export default function Dashboard() {
    const { events, toggleEventCompletion } = useTodo();
    
    // Stats Calculations
    const stats = useMemo(() => {
        const total = events.length;
        const completed = events.filter(e => e.completed).length;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
        
        // Busiest Day
        const dayCounts = {};
        events.forEach(e => {
            dayCounts[e.day] = (dayCounts[e.day] || 0) + 1;
        });
        let busiestDay = 1;
        let maxTasks = 0;
        Object.entries(dayCounts).forEach(([day, count]) => {
            if (count > maxTasks) {
                maxTasks = count;
                busiestDay = parseInt(day);
            }
        });
        const dayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const busiestDayName = maxTasks === 0 ? 'None' : dayNames[busiestDay];

        // Category Breakdown
        const cats = {};
        events.forEach(e => {
            const c = e.category || 'other';
            cats[c] = (cats[c] || 0) + 1;
        });
        
        // Fake a streak based on overall completion (since we don't have historical days in this demo)
        const streak = Math.floor(completed / 3);

        return { total, completed, completionRate, busiestDayName, maxTasks, cats, streak };
    }, [events]);

    // Today's Tasks
    const todayEvents = useMemo(() => {
        const todayDayIndex = new Date().getDay() === 0 ? 7 : new Date().getDay();
        return events.filter(e => e.day === todayDayIndex).sort((a, b) => a.start.localeCompare(b.start));
    }, [events]);

    const todayCompletedCount = todayEvents.filter(e => e.completed).length;
    const todayTotalCount = todayEvents.length;
    const todayProgressPercent = todayTotalCount === 0 ? 0 : Math.round((todayCompletedCount / todayTotalCount) * 100);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Overview & Analytics</h2>
                <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Quick Stats Row */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-icon"><Trophy size={24} weight="fill" color="#f59e0b" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.completionRate}%</span>
                        <span className="stat-label">Weekly Completion</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><Fire size={24} weight="fill" color="#ef4444" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.streak} Days</span>
                        <span className="stat-label">Current Streak</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><CalendarCheck size={24} weight="fill" color="#3b82f6" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.busiestDayName}</span>
                        <span className="stat-label">Busiest Day ({stats.maxTasks} tasks)</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><ChartPieSlice size={24} weight="fill" color="#10b981" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{Object.keys(stats.cats).length}</span>
                        <span className="stat-label">Active Categories</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Left Col: Today's Tasks */}
                <div className="dashboard-today">
                    <h3>Today's Agenda</h3>
                    
                    <div className="progress-container">
                        <div className="progress-header">
                            <span>Daily Progress</span>
                            <span>{todayCompletedCount} of {todayTotalCount} ({todayProgressPercent}%)</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${todayProgressPercent}%` }} />
                        </div>
                    </div>

                    <div className="today-checklist">
                        {todayEvents.length === 0 ? (
                            <div className="empty-state">No tasks scheduled for today! Relax or add some.</div>
                        ) : (
                            todayEvents.map(event => (
                                <div 
                                    key={event.id}
                                    className={`checklist-item ${event.completed ? 'completed' : ''}`}
                                    onClick={() => toggleEventCompletion(event.id)}
                                >
                                    <div className="check-icon">
                                        {event.completed ? <CheckCircle size={28} weight="fill" color="var(--sidebar-active)" /> : <Circle size={28} color="#ccc" />}
                                    </div>
                                    <div className="check-content">
                                        <h4>{event.title}</h4>
                                        <p>{event.start} - {event.end} • {event.loc}</p>
                                    </div>
                                    {event.priority && (
                                        <span className="priority-dot" title={`${event.priority} priority`}>
                                            {event.priority === 'high' ? '🔴' : event.priority === 'medium' ? '🟡' : '🟢'}
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Col: Category Breakdown */}
                <div className="dashboard-categories">
                    <h3>Category Breakdown</h3>
                    <div className="category-list">
                        {Object.entries(stats.cats).map(([cat, count]) => (
                            <div key={cat} className="category-stat-item">
                                <div className="cat-stat-label">
                                    <span className="cat-stat-name">{cat}</span>
                                    <span className="cat-stat-count">{count} tasks</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill cat-fill" style={{ width: `${(count / stats.total) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
