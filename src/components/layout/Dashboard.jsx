import React, { useMemo } from 'react';
import { useTodo } from '../../store/TodoContext';
import { CheckCircle, Circle } from '@phosphor-icons/react';

export default function Dashboard() {
    const { events, toggleEventCompletion } = useTodo();
    
    // Calculate today's tasks
    const todayEvents = useMemo(() => {
        const todayDayIndex = new Date().getDay() === 0 ? 7 : new Date().getDay();
        return events.filter(e => e.day === todayDayIndex).sort((a, b) => a.start.localeCompare(b.start));
    }, [events]);

    const completedCount = todayEvents.filter(e => e.completed).length;
    const totalCount = todayEvents.length;
    const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    return (
        <div style={{ flex: 1, padding: '30px', background: 'white', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Today's Tasks</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>

            {/* Progress Bar */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '600' }}>Daily Progress</span>
                    <span style={{ color: 'var(--text-muted)' }}>{completedCount} of {totalCount} completed ({progressPercent}%)</span>
                </div>
                <div style={{ height: '10px', background: '#e9ecef', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ 
                        height: '100%', 
                        background: 'var(--sidebar-active)', 
                        width: `${progressPercent}%`,
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            {/* Checklist */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {todayEvents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        You have no tasks scheduled for today! Relax or add some tasks.
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {todayEvents.map(event => (
                            <div 
                                key={event.id}
                                onClick={() => toggleEventCompletion(event.id)}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    padding: '16px', 
                                    border: '1px solid var(--border-color)', 
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: event.completed ? '#fdfdfd' : 'white',
                                    opacity: event.completed ? 0.6 : 1
                                }}
                            >
                                <div style={{ marginRight: '16px', color: event.completed ? 'var(--sidebar-active)' : '#ccc' }}>
                                    {event.completed ? <CheckCircle size={28} weight="fill" /> : <Circle size={28} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ 
                                        margin: 0, 
                                        fontSize: '16px', 
                                        fontWeight: '600',
                                        textDecoration: event.completed ? 'line-through' : 'none'
                                    }}>
                                        {event.title}
                                    </h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                                        {event.start} - {event.end} • {event.loc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
