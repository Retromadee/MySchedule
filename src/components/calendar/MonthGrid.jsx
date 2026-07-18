import React from 'react';
import { useTodo } from '../../store/TodoContext';

export default function MonthGrid() {
    const { events } = useTodo();
    
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '14px', border: '1px solid var(--border-color)', padding: '20px', overflow: 'auto' }}>
            <h2 style={{ marginBottom: '15px', fontSize: '20px' }}>Month View</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border-color)', border: '1px solid var(--border-color)' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} style={{ background: '#fcfcfc', padding: '10px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>{day}</div>
                ))}
                {/* 35 dummy day cells for standard month view */}
                {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} style={{ background: 'white', minHeight: '100px', padding: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#999' }}>{i % 30 + 1}</span>
                    </div>
                ))}
            </div>
            <p style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                * Full monthly calendar events mapping coming soon.
            </p>
        </div>
    );
}
