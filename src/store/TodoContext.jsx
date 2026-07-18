import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/StorageService';

const TodoContext = createContext();

export function TodoProvider({ children }) {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [detailEvent, setDetailEvent] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null); // category filter from sidebar

    useEffect(() => {
        loadEvents();
    }, []);

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
            resetEvents
        }}>
            {children}
        </TodoContext.Provider>
    );
}

export function useTodo() {
    return useContext(TodoContext);
}
