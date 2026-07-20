import React, { useEffect, useRef } from 'react';
import './NotificationsPanel.css';
import { Bell, Clock, CheckCircle, Warning, X } from '@phosphor-icons/react';
import { useTodo } from '../../store/TodoContext';

function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

export default function NotificationsPanel({ isOpen, onClose }) {
    const { allEvents, setDetailEvent } = useTodo();
    const panelRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handleOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [isOpen, onClose]);

    const now = new Date();
    const todayDayIndex = now.getDay() === 0 ? 7 : now.getDay();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    const nowMins = now.getHours() * 60 + now.getMinutes();

    // Today's events (date-aware)
    const todayEvents = allEvents.filter(e =>
        e.date ? e.date === formattedToday : e.day === todayDayIndex
    );

    const upcoming = todayEvents
        .filter(e => !e.completed && timeToMinutes(e.start) > nowMins)
        .sort((a, b) => a.start.localeCompare(b.start));

    const overdue = todayEvents
        .filter(e => !e.completed && timeToMinutes(e.end) < nowMins)
        .sort((a, b) => a.start.localeCompare(b.start));

    const total = upcoming.length + overdue.length;

    const handleEventClick = (ev) => {
        setDetailEvent(ev);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="notif-panel" ref={panelRef}>
            <div className="notif-header">
                <span className="notif-title">Notifications</span>
                {total > 0 && <span className="notif-count-badge">{total}</span>}
                <button className="notif-close" onClick={onClose}><X size={15} weight="bold" /></button>
            </div>

            <div className="notif-body">
                {total === 0 ? (
                    <div className="notif-empty">
                        <CheckCircle size={32} weight="fill" color="#22c55e" />
                        <span>You're all caught up!</span>
                        <span className="notif-empty-sub">No upcoming or overdue tasks today.</span>
                    </div>
                ) : (
                    <>
                        {overdue.length > 0 && (
                            <div className="notif-section">
                                <div className="notif-section-title overdue-title">
                                    <Warning size={13} weight="fill" /> Overdue
                                </div>
                                {overdue.map(ev => (
                                    <div key={ev.id} className="notif-item overdue-item" onClick={() => handleEventClick(ev)}>
                                        <div className="notif-item-dot overdue-dot" />
                                        <div className="notif-item-body">
                                            <div className="notif-item-title">{ev.title}</div>
                                            <div className="notif-item-meta">{ev.start} – {ev.end} · {ev.loc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {upcoming.length > 0 && (
                            <div className="notif-section">
                                <div className="notif-section-title upcoming-title">
                                    <Clock size={13} weight="fill" /> Upcoming Today
                                </div>
                                {upcoming.map(ev => (
                                    <div key={ev.id} className="notif-item upcoming-item" onClick={() => handleEventClick(ev)}>
                                        <div className="notif-item-dot upcoming-dot" />
                                        <div className="notif-item-body">
                                            <div className="notif-item-title">{ev.title}</div>
                                            <div className="notif-item-meta">{ev.start} – {ev.end} · {ev.loc}</div>
                                        </div>
                                        <div className="notif-item-time">
                                            {ev.start}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// Export the notification count so Topbar can show the badge
export function useNotificationCount() {
    const { allEvents } = useTodo();
    const now = new Date();
    const todayDayIndex = now.getDay() === 0 ? 7 : now.getDay();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    const nowMins = now.getHours() * 60 + now.getMinutes();

    const todayEvents = allEvents.filter(e =>
        e.date ? e.date === formattedToday : e.day === todayDayIndex
    );

    const count = todayEvents.filter(e =>
        !e.completed && (
            timeToMinutes(e.start) > nowMins ||   // upcoming
            timeToMinutes(e.end) < nowMins          // overdue
        )
    ).length;

    return count;
}
