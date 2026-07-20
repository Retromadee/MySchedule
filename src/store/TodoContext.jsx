import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/StorageService';

const TodoContext = createContext();

export function TodoProvider({ children }) {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [detailEvent, setDetailEvent] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null); // category filter from sidebar
    const [calendarView, setCalendarView] = useState('week'); // 'day', 'week', 'month'
    const [activeRoute, setActiveRoute] = useState('schedule'); // 'schedule', 'dashboard'

    const [theme, setTheme] = useState(() => localStorage.getItem('lifesync_theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('lifesync_theme', theme);
    }, [theme]);

    useEffect(() => {
        loadEvents();
    }, []);

    // Notification System
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        const checkReminders = () => {
            if ('Notification' in window && Notification.permission === 'granted') {
                const now = new Date();
                const todayDayIndex = now.getDay() === 0 ? 7 : now.getDay();
                const yyyy = now.getFullYear();
                const mm = String(now.getMonth() + 1).padStart(2, '0');
                const dd = String(now.getDate()).padStart(2, '0');
                const formattedToday = `${yyyy}-${mm}-${dd}`;
                
                events.forEach(event => {
                    if (event.completed) return;
                    
                    if (event.date) {
                        if (event.date !== formattedToday) return;
                    } else {
                        if (event.day !== todayDayIndex) return;
                    }
                    
                    const [startH, startM] = event.start.split(':').map(Number);
                    const eventDate = new Date();
                    eventDate.setHours(startH, startM, 0, 0);
                    
                    const diffMs = eventDate - now;
                    const diffMins = Math.round(diffMs / 60000);
                    
                    // Remind if exactly 5 mins away
                    if (diffMins === 5) {
                        new Notification(`Upcoming: ${event.title}`, {
                            body: `Starts at ${event.start} ${event.loc ? '- ' + event.loc : ''}`,
                        });
                    }
                });
            }
        };

        const intervalId = setInterval(checkReminders, 60000);
        return () => clearInterval(intervalId);
    }, [events]);

    const loadEvents = useCallback(() => {
        setEvents(StorageService.getEvents());
    }, []);

    const addEvent = useCallback((eventData) => {
        StorageService.addEvent(eventData);
        loadEvents();
    }, [loadEvents]);

    const updateEvent = useCallback((updatedEvent) => {
        StorageService.updateEvent(updatedEvent);
        loadEvents();
    }, [loadEvents]);

    const deleteEvent = useCallback((eventId) => {
        StorageService.deleteEvent(eventId);
        loadEvents();
        setDetailEvent(null);
    }, [loadEvents]);

    const toggleEventCompletion = useCallback((eventId) => {
        const eventToUpdate = events.find(e => e.id === eventId);
        if (eventToUpdate) {
            updateEvent({ ...eventToUpdate, completed: !eventToUpdate.completed });
        }
    }, [events, updateEvent]);

    const openEditModal = useCallback((event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    }, []);

    const openAddModal = useCallback(() => {
        setEditingEvent(null);
        setIsModalOpen(true);
    }, []);

    const resetEvents = useCallback(() => {
        const defaults = StorageService.resetToDefaults();
        setEvents(defaults);
    }, []);

    // Filtered events for display
    const filteredEvents = activeFilter
        ? events.filter(e => e.category === activeFilter)
        : events;

    return (
        <TodoContext.Provider value={{
            events: filteredEvents,
            allEvents: events,
            loadEvents,
            addEvent,
            updateEvent,
            deleteEvent,
            toggleEventCompletion,
            isModalOpen,
            setIsModalOpen,
            editingEvent,
            setEditingEvent,
            openEditModal,
            openAddModal,
            detailEvent,
            setDetailEvent,
            activeFilter,
            setActiveFilter,
            calendarView,
            setCalendarView,
            activeRoute,
            setActiveRoute,
            resetEvents,
            theme,
            setTheme
        }}>
            {children}
        </TodoContext.Provider>
    );
}

export function useTodo() {
    return useContext(TodoContext);
}
