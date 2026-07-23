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
    const [date, setDate] = useState('');
    const [start, setStart] = useState('08:00');
    const [end, setEnd] = useState('09:00');
    const [priority, setPriority] = useState('medium');
    const [notes, setNotes] = useState('');
    const [subtasks, setSubtasks] = useState([]);
    const [newSubtaskText, setNewSubtaskText] = useState('');

    useEffect(() => {
        if (editingEvent) {
            setTitle(editingEvent.title || '');
            setLoc(editingEvent.loc || '');
            setCategory(editingEvent.category || 'projects');
            setDay(editingEvent.day || 1);
            setDate(editingEvent.date || '');
            setStart(editingEvent.start || '08:00');
            setEnd(editingEvent.end || '09:00');
            setPriority(editingEvent.priority || 'medium');
            setNotes(editingEvent.notes || '');
            setSubtasks(editingEvent.subtasks ? [...editingEvent.subtasks] : []);
        } else {
            setTitle('');
            setLoc('');
            setCategory('projects');
            setDay(1);
            setDate('');
            setStart('08:00');
            setEnd('09:00');
            setPriority('medium');
            setNotes('');
            setSubtasks([]);
        }
        setNewSubtaskText('');
    }, [editingEvent, isModalOpen]);

    if (!isModalOpen) return null;

    const handleAddSubtask = () => {
        if (!newSubtaskText.trim()) return;
        setSubtasks(prev => [...prev, { id: Date.now() + Math.random(), text: newSubtaskText.trim(), completed: false }]);
        setNewSubtaskText('');
    };

    const handleRemoveSubtask = (id) => {
        setSubtasks(prev => prev.filter(s => s.id !== id));
    };

    const handleDateChange = (val) => {
        setDate(val);
        if (val) {
            const [yyyy, mm, dd] = val.split('-').map(Number);
            const localDate = new Date(yyyy, mm - 1, dd);
            const dayOfWeek = localDate.getDay(); // 0 = Sunday, 1 = Monday
            const dayNum = dayOfWeek === 0 ? 7 : dayOfWeek;
            setDay(dayNum);
        }
    };

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
            date: date || undefined,
            start,
            end,
            icon: mapping.icon,
            iconColor: mapping.iconColor,
            category,
            priority,
            notes,
            subtasks
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
                    <div className="form-group">
                        <label htmlFor="taskDate">Date (Optional - for specific calendar day)</label>
                        <input id="taskDate" type="date" value={date} onChange={(e) => handleDateChange(e.target.value)} />
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
                        <label>Subtasks / Checklist</label>
                        <div className="subtask-input-row">
                            <input
                                type="text"
                                placeholder="Add a subtask..."
                                value={newSubtaskText}
                                onChange={(e) => setNewSubtaskText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                            />
                            <button type="button" className="subtask-add-btn" onClick={handleAddSubtask}>
                                Add
                            </button>
                        </div>
                        {subtasks.length > 0 && (
                            <ul className="subtask-list">
                                {subtasks.map((st) => (
                                    <li key={st.id} className="subtask-item">
                                        <span>{st.text}</span>
                                        <button type="button" className="subtask-del-btn" onClick={() => handleRemoveSubtask(st.id)}>✕</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="taskNotes">Notes</label>
                        <textarea
                            id="taskNotes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes, links, or reminders..."
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="button" className="btn-cancel" onClick={handleClose}>Cancel</button>
                        <button type="submit" className="btn-submit">{editingEvent ? 'Update' : 'Save Task'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
