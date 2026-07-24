import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/StorageService';
import { get, onValue, ref, set } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const TodoContext = createContext();

export function TodoProvider({ children }) {
    const { user, profile, loading: authLoading } = useAuth();
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [detailEvent, setDetailEvent] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [calendarView, setCalendarView] = useState('week');
    const [activeRoute, setActiveRoute] = useState('schedule');

    const [priorityFilter, setPriorityFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const [theme, setTheme] = useState(() => localStorage.getItem('lifesync_theme') || 'light');

    const loadEvents = useCallback(async () => {
        if (user) {
            const snapshot = await get(ref(database, `users/${user.uid}/events`));
            const loaded = Object.values(snapshot.val() || {});
            if (loaded.length === 0) {
                // Seed default events for new users
                const defaults = StorageService.getEvents();
                await set(ref(database, `users/${user.uid}/events`), Object.fromEntries(defaults.map(event => [event.id, event])));
                setEvents(defaults);
                return;
            }
            setEvents(loaded);
            setDetailEvent(prev => prev ? (loaded.find(e => e.id === prev.id) || null) : null);
            return;
        }
        const loaded = StorageService.getEvents();
        setEvents(loaded);
        setDetailEvent(prev => prev ? (loaded.find(e => e.id === prev.id) || null) : null);
    }, [user]);

    const persistEvents = useCallback((nextEvents) => {
        setEvents(nextEvents);
        if (user) {
            return set(ref(database, `users/${user.uid}/events`), Object.fromEntries(nextEvents.map(event => [event.id, event])));
        }
        StorageService.saveEvents(nextEvents);
        return Promise.resolve();
    }, [user]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('lifesync_theme', theme);
    }, [theme]);

    useEffect(() => {
        if (authLoading) return undefined;
        if (!user) {
            loadEvents();
            return undefined;
        }
        return onValue(ref(database, `users/${user.uid}/events`), snapshot => {
            const loaded = Object.values(snapshot.val() || {});
            setEvents(loaded);
            setDetailEvent(prev => prev ? (loaded.find(event => event.id === prev.id) || null) : null);
        });
    }, [authLoading, user, loadEvents]);

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

    const addEvent = useCallback((eventData) => {
        const event = { ...eventData, id: Date.now(), subtasks: eventData.subtasks || [] };
        persistEvents([...events, event]);
    }, [events, persistEvents]);

    const updateEvent = useCallback((updatedEvent) => {
        persistEvents(events.map(event => event.id === updatedEvent.id ? { ...event, ...updatedEvent } : event));
    }, [events, persistEvents]);

    const deleteEvent = useCallback((eventId) => {
        persistEvents(events.filter(event => event.id !== eventId));
        setDetailEvent(null);
    }, [events, persistEvents]);

    const toggleEventCompletion = useCallback((eventId) => {
        const eventToUpdate = events.find(e => e.id === eventId);
        if (eventToUpdate) {
            updateEvent({ ...eventToUpdate, completed: !eventToUpdate.completed });
        }
    }, [events, updateEvent]);

    const toggleSubtaskCompletion = useCallback((eventId, subtaskId) => {
        persistEvents(events.map(event => {
            if (event.id !== eventId || !Array.isArray(event.subtasks)) return event;
            const subtasks = event.subtasks.map(subtask => subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask);
            return { ...event, subtasks, completed: subtasks.length > 0 ? subtasks.every(subtask => subtask.completed) : event.completed };
        }));
    }, [events, persistEvents]);

    const duplicateEvent = useCallback((eventId) => {
        const source = events.find(event => event.id === eventId);
        if (!source) return;
        const duplicate = { ...source, id: Date.now(), title: `${source.title} (Copy)`, completed: false, subtasks: (source.subtasks || []).map((subtask, index) => ({ ...subtask, id: `${Date.now()}-${index}`, completed: false })) };
        persistEvents([...events, duplicate]);
        setDetailEvent(duplicate);
    }, [events, persistEvents]);

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
        persistEvents(defaults);
    }, [persistEvents]);

    const replaceEvents = useCallback((newEvents) => {
        const normalized = newEvents.map(e => ({ ...e, subtasks: e.subtasks || [] }));
        return persistEvents(normalized);
    }, [persistEvents]);

    // Filtered events for display
    const filteredEvents = events.filter(e => {
        if (activeFilter && e.category !== activeFilter) return false;
        if (priorityFilter !== 'all' && e.priority !== priorityFilter) return false;
        if (statusFilter === 'pending' && e.completed) return false;
        if (statusFilter === 'completed' && !e.completed) return false;
        return true;
    });

    return (
        <TodoContext.Provider value={{
            events: filteredEvents,
            allEvents: events,
            loadEvents,
            addEvent,
            updateEvent,
            deleteEvent,
            toggleEventCompletion,
            toggleSubtaskCompletion,
            duplicateEvent,
            replaceEvents,
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
            priorityFilter,
            setPriorityFilter,
            statusFilter,
            setStatusFilter,
            calendarView,
            setCalendarView,
            activeRoute,
            setActiveRoute,
            resetEvents,
            theme,
            setTheme,
            categories: profile?.categories || ['Personal', 'Work', 'Study']
        }}>
            {children}
        </TodoContext.Provider>
    );
}

export function useTodo() {
    return useContext(TodoContext);
}
