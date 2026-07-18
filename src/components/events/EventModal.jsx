import React, { useState, useEffect } from 'react';
import './EventModal.css';
import { useTodo } from '../../store/TodoContext';

const ICON_MAP = {
    housing: { icon: 'House', iconColor: '#4d72d6' },
    projects: { icon: 'Code', iconColor: '#333' },
    music: { icon: 'Headphones', iconColor: '#000' },
    career: { icon: 'Briefcase', iconColor: '#333' },
    finance: { icon: 'Wallet', iconColor: '#4d72d6' },
};

const COLOR_MAP = {
    housing: 'blue',
    projects: 'grey',
    music: 'yellow',
    career: 'white',
    finance: 'blue',
};

export default function EventModal() {
    const { isModalOpen, setIsModalOpen, addEvent, updateEvent, editingEvent, setEditingEvent } = useTodo();

    const [title, setTitle] = useState('');
    const [loc, setLoc] = useState('');
    const [category, setCategory] = useState('projects');
    const [day, setDay] = useState(1);
    const [start, setStart] = useState('08:00');
    const [end, setEnd] = useState('09:00');
    const [priority, setPriority] = useState('medium');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (editingEvent) {
            setTitle(editingEvent.title || '');
            setLoc(editingEvent.loc || '');
            setCategory(editingEvent.category || 'projects');
            setDay(editingEvent.day || 1);
            setStart(editingEvent.start || '08:00');
            setEnd(editingEvent.end || '09:00');
            setPriority(editingEvent.priority || 'medium');
            setNotes(editingEvent.notes || '');
        } else {
            setTitle('');
            setLoc('');
            setCategory('projects');
            setDay(1);
            setStart('08:00');
            setEnd('09:00');
            setPriority('medium');
            setNotes('');
        }
    }, [editingEvent, isModalOpen]);

    if (!isModalOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Duration validation
        if (start >= end) {
            alert('End time must be after start time.');
            return;
        }

        const mapping = ICON_MAP[category] || { icon: 'CheckCircle', iconColor: '#333' };
        const color = COLOR_MAP[category] || 'grey';

        const eventData = {
            title,
            loc,
            color,
            day: parseInt(day),
            start,
            end,
            icon: mapping.icon,
            iconColor: mapping.iconColor,
            category,
            priority,
            notes,
        };

        if (editingEvent) {
            updateEvent({ ...editingEvent, ...eventData });
        } else {
            addEvent(eventData);
        }

        setIsModalOpen(false);
        setEditingEvent(null);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{editingEvent ? 'Edit Task' : 'Add New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="taskTitle">Task Title</label>
                        <input id="taskTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="taskLoc">Description / Location</label>
                        <input id="taskLoc" type="text" value={loc} onChange={(e) => setLoc(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="taskCategory">Category</label>
                        <select id="taskCategory" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="housing">🏠 Housing Search</option>
                            <option value="projects">💻 Projects (Mahir & Uni)</option>
                            <option value="music">🎵 Music & Events</option>
                            <option value="career">💼 Career & Admin</option>
                            <option value="finance">💰 Finances & Study</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="taskPriority">Priority</label>
                        <select id="taskPriority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="taskDay">Day (1-7)</label>
                            <input id="taskDay" type="number" min="1" max="7" value={day} onChange={(e) => setDay(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="taskStart">Start Time</label>
                            <input id="taskStart" type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="taskEnd">End Time</label>
                            <input id="taskEnd" type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="taskNotes">Notes</label>
                        <textarea
                            id="taskNotes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes, links, or reminders..."
                            style={{ width: '100%', minHeight: '60px', border: '1px solid #ddd', borderRadius: '8px', padding: '10px', fontFamily: 'inherit', resize: 'vertical' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="button" className="btn-submit" onClick={handleClose} style={{ background: '#eee', color: '#333' }}>Cancel</button>
                        <button type="submit" className="btn-submit">{editingEvent ? 'Update' : 'Save Task'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
