import React, { useState } from 'react';
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
    const { openAddModal, loadEvents, activeFilter, activeRoute, calendarView } = useTodo();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
