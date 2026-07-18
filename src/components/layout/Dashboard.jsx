import React from 'react';
import { useTodo } from '../../store/TodoContext';

export default function Dashboard() {
    const { events } = useTodo();
    
    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '14px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Dashboard Overview</h2>
            <p style={{ color: 'var(--text-muted)' }}>You have {events.length} total tasks scheduled.</p>
            <div style={{ marginTop: '20px', padding: '15px', background: '#f7f4eb', borderRadius: '10px' }}>
                Dashboard visualization components coming soon...
            </div>
        </div>
    );
}
