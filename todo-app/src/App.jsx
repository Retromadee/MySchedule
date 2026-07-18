import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import HeaderArea from './components/layout/HeaderArea';
import CalendarGrid from './components/calendar/CalendarGrid';
import EventModal from './components/events/EventModal';
import EventDetail from './components/events/EventDetail';
import { useTodo } from './store/TodoContext';
import './App.css';

export default function App() {
    const { openAddModal, loadEvents, activeFilter } = useTodo();
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
                <CalendarGrid />
            </main>
            <EventModal />
            <EventDetail />
        </div>
    );
}
