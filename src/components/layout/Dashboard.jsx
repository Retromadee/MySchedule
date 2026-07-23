import React, { useMemo } from 'react';
import { useTodo } from '../../store/TodoContext';
import { CheckCircle, Circle, ChartPieSlice, CalendarCheck, Trophy, ListChecks } from '@phosphor-icons/react';
import './Dashboard.css';
import { eventsForDate } from '../../utils/eventUtils';

export default function Dashboard() {
    const { events, allEvents = events, toggleEventCompletion, setDetailEvent } = useTodo();
    
    // Stats Calculations
    const stats = useMemo(() => {
        const total = allEvents.length;
        const completed = allEvents.filter(e => e.completed).length;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
        
        // Priority breakdown
        const priorityCounts = { high: 0, medium: 0, low: 0 };
        allEvents.forEach(e => {
            if (e.priority && priorityCounts[e.priority] !== undefined) {
                priorityCounts[e.priority]++;
            }
        });

        // Busiest Day
        const dayCounts = {};
        allEvents.forEach(e => {
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
        allEvents.forEach(e => {
            const c = e.category || 'other';
            cats[c] = (cats[c] || 0) + 1;
        });
        
        return { total, completed, completionRate, busiestDayName, maxTasks, cats, priorityCounts };
    }, [allEvents]);

    // Today's Tasks — supports date-specific and recurring weekday events
    const todayEvents = useMemo(() => {
        const now = new Date();
        return eventsForDate(allEvents, now)
            .sort((a, b) => a.start.localeCompare(b.start));
    }, [allEvents]);

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
                        <span className="stat-label">Overall Completion</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><CheckCircle size={24} weight="fill" color="var(--sidebar-active)" /></div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.completed}</span>
                        <span className="stat-label">Completed Tasks</span>
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
                            todayEvents.map(event => {
                                const subtasks = event.subtasks || [];
                                const doneSubtasks = subtasks.filter(s => s.completed).length;
                                return (
                                    <div 
                                        key={event.id}
                                        className={`checklist-item ${event.completed ? 'completed' : ''}`}
                                    >
                                        <div className="check-icon" onClick={(e) => { e.stopPropagation(); toggleEventCompletion(event.id); }}>
                                            {event.completed ? <CheckCircle size={28} weight="fill" color="var(--sidebar-active)" /> : <Circle size={28} color="#ccc" />}
                                        </div>
                                        <div className="check-content" onClick={() => setDetailEvent(event)} style={{ cursor: 'pointer' }}>
                                            <h4>{event.title}</h4>
                                            <p>{event.start} - {event.end} • {event.loc}</p>
                                            {subtasks.length > 0 && (
                                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                                    <ListChecks size={12} /> {doneSubtasks}/{subtasks.length} subtasks
                                                </span>
                                            )}
                                        </div>
                                        {event.priority && (
                                            <span className="priority-dot" title={`${event.priority} priority`}>
                                                {event.priority === 'high' ? '🔴' : event.priority === 'medium' ? '🟡' : '🟢'}
                                            </span>
                                        )}
                                    </div>
                                );
                            })
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
                                    <span className="cat-stat-name" style={{ textTransform: 'capitalize' }}>{cat}</span>
                                    <span className="cat-stat-count">{count} tasks</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div className="progress-bar-fill cat-fill" style={{ width: `${(count / stats.total) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3 style={{ marginTop: '24px' }}>Priority Breakdown</h3>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                        <div style={{ flex: 1, padding: '12px', background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #eee)', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>{stats.priorityCounts.high}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🔴 High</div>
                        </div>
                        <div style={{ flex: 1, padding: '12px', background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #eee)', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.priorityCounts.medium}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🟡 Medium</div>
                        </div>
                        <div style={{ flex: 1, padding: '12px', background: 'var(--card-bg, #fff)', border: '1px solid var(--border-color, #eee)', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>{stats.priorityCounts.low}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🟢 Low</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
