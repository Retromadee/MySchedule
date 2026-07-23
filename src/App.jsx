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
import SettingsModal from './components/layout/SettingsModal';
import { useTodo } from './store/TodoContext';
import { useAuth } from './contexts/AuthContext';
import { AuthScreen, Onboarding } from './components/auth/AuthScreen';
import { isFirebaseConfigured } from './firebase';
import './App.css';

export default function App() {
    const { user, profile, loading } = useAuth();
    const { openAddModal, loadEvents, activeFilter, setActiveFilter, activeRoute, calendarView, setIsModalOpen, setDetailEvent } = useTodo();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

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
                setSettingsOpen(false);
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

    if (loading) return <div className="app-loading">Loading your schedule…</div>;
    if (!isFirebaseConfigured) return <div className="app-loading">Firebase is not configured for this deployment.</div>;
    if (!user) return <AuthScreen />;
    if (!profile?.onboardingComplete) return <Onboarding />;

    return (
        <div className="app-shell">
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
            )}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onSettingsOpen={() => setSettingsOpen(true)}
            />
            <main className="main-content">
                <Topbar
                    onMenuToggle={() => setSidebarOpen(prev => !prev)}
                    onSettingsOpen={() => setSettingsOpen(true)}
                />
                <HeaderArea
                    onAddClick={openAddModal}
                    onRefresh={loadEvents}
                    activeFilter={activeFilter}
                    onClearFilter={() => setActiveFilter(null)}
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
            <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
    );
}
