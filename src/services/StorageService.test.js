// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from './StorageService';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; }
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true });

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default events if storage is empty', () => {
    const events = StorageService.getEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty('title');
  });

  it('should add a new event correctly', () => {
    const initialCount = StorageService.getEvents().length;
    const newEvent = {
      title: 'Test Event',
      start: '10:00',
      end: '11:00',
      day: 1,
      loc: 'Office',
      category: 'Projects',
      priority: 'high'
    };
    StorageService.addEvent(newEvent);
    const events = StorageService.getEvents();
    expect(events.length).toBe(initialCount + 1);
    expect(events.find(e => e.title === 'Test Event')).toBeDefined();
  });

  it('should update an event correctly', () => {
    const events = StorageService.getEvents();
    const target = events[0];
    const updated = { ...target, title: 'Updated Title' };
    StorageService.updateEvent(updated);
    const newEvents = StorageService.getEvents();
    const check = newEvents.find(e => e.id === target.id);
    expect(check.title).toBe('Updated Title');
  });

  it('should delete an event correctly', () => {
    const events = StorageService.getEvents();
    const target = events[0];
    StorageService.deleteEvent(target.id);
    const newEvents = StorageService.getEvents();
    expect(newEvents.find(e => e.id === target.id)).toBeUndefined();
  });
});
