import React, { useState, useRef, useEffect } from 'react';
import './Topbar.css';
import { MagnifyingGlass, User, Bell, List } from '@phosphor-icons/react';
import { useTodo } from '../../store/TodoContext';

export default function Topbar({ onMenuToggle }) {
    const { allEvents, setDetailEvent } = useTodo();
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const wrapperRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
        <div className="topbar" ref={wrapperRef}>
            <div className="topbar-left">
                <button className="menu-toggle-btn" onClick={onMenuToggle}>
                    <List size={24} />
                </button>
            </div>
            
            <div className="search-container">
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
                <button className="action-btn" onClick={() => alert('User Profile & Preferences coming soon!')}><User size={20} /></button>
                <button className="action-btn" onClick={() => alert('You have 0 new notifications')}><Bell size={20} /></button>
            </div>
        </div>
    );
}
