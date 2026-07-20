import React, { useState, useEffect } from 'react';
import './SettingsModal.css';
import {
    X, Sun, Moon, ArrowCounterClockwise, DownloadSimple, UploadSimple, Gear
} from '@phosphor-icons/react';
import { useTodo } from '../../store/TodoContext';
import { StorageService } from '../../services/StorageService';

export default function SettingsModal({ isOpen, onClose }) {
    const { allEvents, resetEvents, loadEvents } = useTodo();
    const [theme, setTheme] = useState(() => localStorage.getItem('lifesync_theme') || 'light');
    const [importStatus, setImportStatus] = useState(null); // 'success' | 'error' | null

    // Apply theme to document root
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('lifesync_theme', theme);
    }, [theme]);

    if (!isOpen) return null;

    const handleExport = () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allEvents, null, 2));
        const a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', 'lifesync_backup.json');
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const handleImport = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const parsed = JSON.parse(ev.target.result);
                if (!Array.isArray(parsed)) throw new Error('Invalid format');
                StorageService.saveEvents(parsed);
                loadEvents();
                setImportStatus('success');
                setTimeout(() => setImportStatus(null), 3000);
            } catch {
                setImportStatus('error');
                setTimeout(() => setImportStatus(null), 3000);
            }
        };
        reader.readAsText(file);
        // Reset input so same file can be re-imported
        e.target.value = '';
    };

    const handleReset = () => {
        if (window.confirm('Reset all data to defaults? This cannot be undone.')) {
            resetEvents();
        }
    };

    return (
        <>
            <div className="settings-backdrop" onClick={onClose} />
            <div className="settings-modal">
                <div className="settings-header">
                    <div className="settings-header-left">
                        <Gear size={20} weight="fill" />
                        <h2>Settings</h2>
                    </div>
                    <button className="settings-close-btn" onClick={onClose}>
                        <X size={18} weight="bold" />
                    </button>
                </div>

                <div className="settings-body">

                    {/* Theme */}
                    <div className="settings-section">
                        <div className="settings-section-title">Appearance</div>
                        <div className="settings-row">
                            <div className="settings-row-info">
                                <span className="settings-row-label">Theme</span>
                                <span className="settings-row-desc">Switch between light and dark mode</span>
                            </div>
                            <div className="theme-toggle">
                                <button
                                    className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                                    onClick={() => setTheme('light')}
                                >
                                    <Sun size={16} weight={theme === 'light' ? 'fill' : 'regular'} />
                                    Light
                                </button>
                                <button
                                    className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => setTheme('dark')}
                                >
                                    <Moon size={16} weight={theme === 'dark' ? 'fill' : 'regular'} />
                                    Dark
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Data Management */}
                    <div className="settings-section">
                        <div className="settings-section-title">Data Management</div>

                        <div className="settings-row">
                            <div className="settings-row-info">
                                <span className="settings-row-label">Export Data</span>
                                <span className="settings-row-desc">Download all your tasks as a JSON backup</span>
                            </div>
                            <button className="settings-action-btn export-btn" onClick={handleExport}>
                                <DownloadSimple size={16} />
                                Export
                            </button>
                        </div>

                        <div className="settings-row">
                            <div className="settings-row-info">
                                <span className="settings-row-label">Import Data</span>
                                <span className="settings-row-desc">
                                    Restore from a JSON backup file
                                    {importStatus === 'success' && <span className="import-success"> ✓ Imported!</span>}
                                    {importStatus === 'error' && <span className="import-error"> ✗ Invalid file</span>}
                                </span>
                            </div>
                            <label className="settings-action-btn import-btn">
                                <UploadSimple size={16} />
                                Import
                                <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="settings-section danger-zone">
                        <div className="settings-section-title">Danger Zone</div>
                        <div className="settings-row">
                            <div className="settings-row-info">
                                <span className="settings-row-label">Reset All Data</span>
                                <span className="settings-row-desc">Restore to the default schedule. All custom tasks will be lost.</span>
                            </div>
                            <button className="settings-action-btn reset-btn" onClick={handleReset}>
                                <ArrowCounterClockwise size={16} />
                                Reset
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
