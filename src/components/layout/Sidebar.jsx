import React from 'react';
import './Sidebar.css';
import { 
    SquaresFour, CalendarBlank, House, Code,
    Headphones, Briefcase, Wallet, Gear, X, ListChecks, DownloadSimple
} from '@phosphor-icons/react';
import { useTodo } from '../../store/TodoContext';

export default function Sidebar({ isOpen, onClose }) {
    const { activeFilter, setActiveFilter, activeRoute, setActiveRoute, allEvents } = useTodo();

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allEvents, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "lifesync_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo">LifeSync</div>
                {isOpen && (
                    <button className="sidebar-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                )}
                {!isOpen && <div className="logo-icon">›</div>}
            </div>

            <div className="sidebar-section">
                <div className="section-title">GENERAL</div>
                <div 
                    className={`nav-item ${activeRoute === 'dashboard' ? 'active' : ''}`}
                    onClick={() => { setActiveRoute('dashboard'); onClose?.(); }}
                >
                    <SquaresFour size={20} />
                    <span>Dashboard</span>
                </div>
                <div 
                    className={`nav-item ${activeRoute === 'schedule' ? 'active' : ''}`}
                    onClick={() => { setActiveRoute('schedule'); onClose?.(); }}
                >
                    <CalendarBlank size={20} />
                    <span>Schedule</span>
                </div>
                <div 
                    className={`nav-item ${activeRoute === 'planner' ? 'active' : ''}`}
                    onClick={() => { setActiveRoute('planner'); onClose?.(); }}
                >
                    <ListChecks size={20} />
                    <span>Weekly Planner</span>
                </div>
            </div>

            <div className="sidebar-section">
                <div className="section-title">FOCUS AREAS</div>
                
                <div 
                    className={`nav-item ${activeFilter === 'Housing Search' ? 'active' : ''}`}
                    onClick={() => { setActiveFilter('Housing Search'); onClose?.(); }}
                >
                    <House size={20} />
                    <span>Housing Search</span>
                </div>
                <div 
                    className={`nav-item ${activeFilter === 'Projects (Mahir & Uni)' ? 'active' : ''}`}
                    onClick={() => { setActiveFilter('Projects (Mahir & Uni)'); onClose?.(); }}
                >
                    <Code size={20} />
                    <span>Projects (Mahir & Uni)</span>
                </div>
                <div 
                    className={`nav-item ${activeFilter === 'Music & Events' ? 'active' : ''}`}
                    onClick={() => { setActiveFilter('Music & Events'); onClose?.(); }}
                >
                    <Headphones size={20} />
                    <span>Music & Events</span>
                </div>
                <div 
                    className={`nav-item ${activeFilter === 'Career & Admin' ? 'active' : ''}`}
                    onClick={() => { setActiveFilter('Career & Admin'); onClose?.(); }}
                >
                    <Briefcase size={20} />
                    <span>Career & Admin</span>
                </div>
                <div 
                    className={`nav-item ${activeFilter === 'Finances & Study' ? 'active' : ''}`}
                    onClick={() => { setActiveFilter('Finances & Study'); onClose?.(); }}
                >
                    <Wallet size={20} />
                    <span>Finances & Study</span>
                </div>
            </div>

            <div className="sidebar-footer">
                <div className="nav-item" onClick={handleExport}>
                    <DownloadSimple size={20} />
                    <span>Export Data</span>
                </div>
                <div className="nav-item" onClick={() => alert('Settings Modal: User Preferences coming soon!')}>
                    <Gear size={20} />
                    <span>Settings</span>
                </div>
            </div>
        </aside>
    );
}
