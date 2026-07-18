import React, { useState, useEffect } from 'react';
import './EventDetail.css';
import { X, Clock, MapPin, Notebook, PencilSimple, Trash, Tag } from '@phosphor-icons/react';
import { useTodo } from '../../store/TodoContext';

const CATEGORY_COLORS = {
    housing: { bg: '#dbeafe', text: '#1d4ed8' },
    projects: { bg: '#e8e6dd', text: '#333' },
    music: { bg: '#fef3c7', text: '#92400e' },
    career: { bg: '#fce7f3', text: '#9d174d' },
    finance: { bg: '#d1fae5', text: '#065f46' },
};

const DAY_NAMES = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function EventDetail() {
    const { detailEvent, setDetailEvent, deleteEvent, openEditModal, updateEvent } = useTodo();
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (detailEvent) {
            setNotes(detailEvent.notes || '');
        }
    }, [detailEvent]);

    if (!detailEvent) return null;

    const catColor = CATEGORY_COLORS[detailEvent.category] || { bg: '#f0f0f0', text: '#333' };

    const handleSaveNotes = () => {
        updateEvent({ ...detailEvent, notes });
    };

    const handleDelete = () => {
        if (window.confirm(`Delete "${detailEvent.title}"?`)) {
            deleteEvent(detailEvent.id);
        }
    };

    const handleEdit = () => {
        openEditModal(detailEvent);
        setDetailEvent(null);
    };

    return (
        <>
            <div className="detail-backdrop" onClick={() => setDetailEvent(null)} />
            <div className="detail-overlay">
                <div className="detail-header">
                    <div className="detail-header-left">
                        <h2>{detailEvent.title}</h2>
                        {detailEvent.category && (
                            <span
                                className="detail-category-badge"
                                style={{ background: catColor.bg, color: catColor.text }}
                            >
                                {detailEvent.category}
                            </span>
                        )}
                        {detailEvent.priority && (
                            <span
                                className="detail-category-badge"
                                style={{
                                    background: detailEvent.priority === 'high' ? '#fee2e2' : detailEvent.priority === 'medium' ? '#fef3c7' : '#dcfce7',
                                    color: detailEvent.priority === 'high' ? '#991b1b' : detailEvent.priority === 'medium' ? '#92400e' : '#166534',
                                    marginLeft: '8px'
                                }}
                            >
                                {detailEvent.priority} priority
                            </span>
                        )}
                    </div>
                    <button className="detail-close-btn" onClick={() => setDetailEvent(null)}>
                        <X size={18} weight="bold" />
                    </button>
                </div>

                <div className="detail-body">
                    <div className="detail-row">
                        <div className="detail-row-icon"><Clock size={18} /></div>
                        <div className="detail-row-content">
                            <div className="detail-row-label">Time</div>
                            <div className="detail-row-value">
                                {DAY_NAMES[detailEvent.day]} · {detailEvent.start} — {detailEvent.end}
                            </div>
                        </div>
                    </div>

                    {detailEvent.loc && (
                        <div className="detail-row">
                            <div className="detail-row-icon"><MapPin size={18} /></div>
                            <div className="detail-row-content">
                                <div className="detail-row-label">Location / Details</div>
                                <div className="detail-row-value">{detailEvent.loc}</div>
                            </div>
                        </div>
                    )}

                    {detailEvent.tag && (
                        <div className="detail-row">
                            <div className="detail-row-icon"><Tag size={18} /></div>
                            <div className="detail-row-content">
                                <div className="detail-row-label">Tag</div>
                                <div className="detail-row-value">{detailEvent.tag}</div>
                            </div>
                        </div>
                    )}

                    <div className="detail-row">
                        <div className="detail-row-icon"><Notebook size={18} /></div>
                        <div className="detail-row-content">
                            <div className="detail-row-label">Notes</div>
                            <textarea
                                className="detail-notes-input"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                onBlur={handleSaveNotes}
                                placeholder="Add notes, links, or reminders..."
                            />
                        </div>
                    </div>
                </div>

                <div className="detail-footer">
                    <button className="detail-btn detail-btn-edit" onClick={handleEdit}>
                        <PencilSimple size={16} /> Edit
                    </button>
                    <button className="detail-btn detail-btn-delete" onClick={handleDelete}>
                        <Trash size={16} /> Delete
                    </button>
                </div>
            </div>
        </>
    );
}
