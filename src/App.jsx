import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import HeaderArea from './components/layout/HeaderArea';
import CalendarGrid from './components/calendar/CalendarGrid';
import MonthGrid from './components/calendar/MonthGrid';
import Dashboard from './components/layout/Dashboard';
import EventModal from './components/events/EventModal';
import EventDetail from './components/events/EventDetail';
import WeeklyPlanner from './components/planner/WeeklyPlanner';
import { useTodo } from './store/TodoContext';
import './App.css';

export default function App() {
    const { openAddModal, loadEvents, activeFilter, activeRoute, calendarView, setIsModalOpen, setDetailEvent } = useTodo();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in an input or textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                if (e.key === 'Escape') {
                    e.target.blur();
                }
                return;
            }

            if (e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                openAddModal();
            } else if (e.key === 'Escape') {
                setIsModalOpen(false);
                setDetailEvent(null);
            } else if (e.key === '/') {
                e.preventDefault();
                const searchInput = document.querySelector('.search-container input');
                if (searchInput) searchInput.focus();
            } else if (e.key === 'ArrowLeft') {
                window.dispatchEvent(new CustomEvent('calendarNav', { detail: 'prev' }));
            } else if (e.key === 'ArrowRight') {
                window.dispatchEvent(new CustomEvent('calendarNav', { detail: 'next' }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [openAddModal, setIsModalOpen, setDetailEvent]);

    return (
        <div className="app-shell">
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="main-content">
                <Topbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
                <HeaderArea
                    onAddClick={openAddModal}
                    onRefresh={loadEvents}
                    activeFilter={activeFilter}
                />
                
                {activeRoute === 'dashboard' ? (
                    <Dashboard />
                ) : activeRoute === 'planner' ? (
                    <WeeklyPlanner />
                ) : (
                    calendarView === 'month' ? <MonthGrid /> : <CalendarGrid />
                )}
            </main>
            <EventModal />
            <EventDetail />
        </div>
    );
}
