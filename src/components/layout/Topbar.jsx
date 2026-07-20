import React, { useState, useRef, useEffect } from 'react';
import './Topbar.css';
import { MagnifyingGlass, User, Bell, List, X, SignOut, Gear, ChartBar } from '@phosphor-icons/react';
import { useTodo } from '../../store/TodoContext';
import NotificationsPanel, { useNotificationCount } from './NotificationsPanel';

export default function Topbar({ onMenuToggle, onSettingsOpen }) {
    const { allEvents, setDetailEvent } = useTodo();
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const wrapperRef = useRef(null);
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    const notifCount = useNotificationCount();
    const completedCount = allEvents.filter(e => e.completed).length;

    // Close search on click outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close profile dropdown on click outside
    useEffect(() => {
        if (!showProfile) return;
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showProfile]);

    const results = query.length > 0
        ? allEvents.filter(e =>
            e.title.toLowerCase().includes(query.toLowerCase()) ||
            (e.loc && e.loc.toLowerCase().includes(query.toLowerCase())) ||
            (e.notes && e.notes.toLowerCase().includes(query.toLowerCase())) ||
            (e.category && e.category.toLowerCase().includes(query.toLowerCase()))
          )
        : [];

    const handleSelect = (event) => {
        setDetailEvent(event);
        setQuery('');
        setShowResults(false);
    };

    return (
        <div className="topbar">
            <div className="topbar-left">
                <button className="menu-toggle-btn" onClick={onMenuToggle}>
                    <List size={24} />
                </button>
            </div>
            
            <div className="search-container" ref={wrapperRef}>
                <MagnifyingGlass size={20} />
                <input
                    type="text"
                    placeholder="Search tasks, gigs, and projects..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => query.length > 0 && setShowResults(true)}
                />
                {query && (
                    <button className="search-clear-btn" onClick={() => { setQuery(''); setShowResults(false); }}>
                        <X size={14} />
                    </button>
                )}
                {showResults && results.length > 0 && (
                    <div className="search-results">
                        {results.map(event => (
                            <div key={event.id} className="search-result-item" onClick={() => handleSelect(event)}>
                                <div className={`search-dot ${event.color}`}></div>
                                <div>
                                    <div className="search-result-title">{event.title}</div>
                                    <div className="search-result-meta">{event.loc} · {event.start}-{event.end}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {showResults && query.length > 0 && results.length === 0 && (
                    <div className="search-results">
                        <div className="search-result-empty">No results for "{query}"</div>
                    </div>
                )}
            </div>

            <div className="top-actions">
                {/* Notifications */}
                <div className="action-btn-wrapper" ref={notifRef} style={{ position: 'relative' }}>
                    <button
                        className={`action-btn ${showNotif ? 'active' : ''}`}
                        onClick={() => { setShowNotif(p => !p); setShowProfile(false); }}
                        title="Notifications"
                    >
                        <Bell size={20} weight={showNotif ? 'fill' : 'regular'} />
                        {notifCount > 0 && (
                            <span className="notif-badge">{notifCount > 9 ? '9+' : notifCount}</span>
                        )}
                    </button>
                    <NotificationsPanel isOpen={showNotif} onClose={() => setShowNotif(false)} />
                </div>

                {/* Profile */}
                <div className="action-btn-wrapper" ref={profileRef} style={{ position: 'relative' }}>
                    <button
                        className={`action-btn profile-btn ${showProfile ? 'active' : ''}`}
                        onClick={() => { setShowProfile(p => !p); setShowNotif(false); }}
                        title="Profile"
                    >
                        <span className="profile-avatar">R</span>
                    </button>

                    {showProfile && (
                        <div className="profile-dropdown">
                            {/* Avatar row */}
                            <div className="profile-drop-header">
                                <div className="profile-drop-avatar">R</div>
                                <div>
                                    <div className="profile-drop-name">Retro</div>
                                    <div className="profile-drop-sub">Personal Dashboard</div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="profile-drop-stats">
                                <div className="profile-stat">
                                    <span className="profile-stat-val">{allEvents.length}</span>
                                    <span className="profile-stat-label">Total Tasks</span>
                                </div>
                                <div className="profile-stat-divider" />
                                <div className="profile-stat">
                                    <span className="profile-stat-val">{completedCount}</span>
                                    <span className="profile-stat-label">Completed</span>
                                </div>
                                <div className="profile-stat-divider" />
                                <div className="profile-stat">
                                    <span className="profile-stat-val">
                                        {allEvents.length === 0 ? 0 : Math.round((completedCount / allEvents.length) * 100)}%
                                    </span>
                                    <span className="profile-stat-label">Rate</span>
                                </div>
                            </div>

                            <div className="profile-drop-divider" />

                            {/* Actions */}
                            <button className="profile-drop-item" onClick={() => { setShowProfile(false); onSettingsOpen?.(); }}>
                                <Gear size={15} />
                                Settings & Preferences
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
