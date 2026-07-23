// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
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

  it('should toggle subtask completion correctly', () => {
    const newEvent = StorageService.addEvent({
      title: 'Subtask Event',
      start: '12:00',
      end: '13:00',
      day: 1,
      subtasks: [
        { id: 1, text: 'Step 1', completed: false },
        { id: 2, text: 'Step 2', completed: false }
      ]
    });

    StorageService.toggleSubtaskCompletion(newEvent.id, 1);
    let events = StorageService.getEvents();
    let updatedEvent = events.find(e => e.id === newEvent.id);
    expect(updatedEvent.subtasks.find(s => s.id === 1).completed).toBe(true);
    expect(updatedEvent.completed).toBe(false);

    // Complete second subtask -> parent auto marks completed
    StorageService.toggleSubtaskCompletion(newEvent.id, 2);
    events = StorageService.getEvents();
    updatedEvent = events.find(e => e.id === newEvent.id);
    expect(updatedEvent.completed).toBe(true);
  });

  it('should duplicate an event correctly', () => {
    const events = StorageService.getEvents();
    const target = events[0];
    const duplicated = StorageService.duplicateEvent(target.id);
    expect(duplicated).not.toBeNull();
    expect(duplicated.title).toBe(`${target.title} (Copy)`);
    
    const allEvents = StorageService.getEvents();
    expect(allEvents.find(e => e.id === duplicated.id)).toBeDefined();
  });

  it('preserves valid imported events and rejects invalid event data', () => {
    const imported = [{ id: 'custom-1', title: 'Imported event', start: '09:00', end: '10:00', date: '2026-08-01' }];
    StorageService.replaceEvents(imported);
    expect(StorageService.getEvents()).toEqual([{ ...imported[0], subtasks: [] }]);
    expect(() => StorageService.replaceEvents([{ title: 'Broken' }])).toThrow('Invalid event data');
  });
});
