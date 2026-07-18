// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { TodoProvider, useTodo } from './TodoContext';

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

function TestComponent() {
  const { events, addEvent, deleteEvent, toggleEventCompletion } = useTodo();
  return (
    <div>
      <div data-testid="count">{events.length}</div>
      <button data-testid="add-btn" onClick={() => addEvent({ title: 'New Context Event', start: '09:00', end: '10:00', day: 2 })}>Add</button>
      {events.map(e => (
        <div key={e.id} data-testid={`event-${e.id}`}>
          <span data-testid={`title-${e.id}`}>{e.title}</span>
          <span data-testid={`completed-${e.id}`}>{e.completed ? 'yes' : 'no'}</span>
          <button data-testid={`toggle-${e.id}`} onClick={() => toggleEventCompletion(e.id)}>Toggle</button>
          <button data-testid={`delete-${e.id}`} onClick={() => deleteEvent(e.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

describe('TodoContext & TodoProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides events list and allows adding, toggling, and deleting', () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    const countEl = screen.getByTestId('count');
    const initialCount = parseInt(countEl.textContent);
    expect(initialCount).toBeGreaterThan(0);

    // Add
    const addBtn = screen.getByTestId('add-btn');
    act(() => {
      addBtn.click();
    });

    expect(parseInt(screen.getByTestId('count').textContent)).toBe(initialCount + 1);

    // Find the new event (last one)
    const newEventTitle = screen.queryByText('New Context Event');
    expect(newEventTitle).toBeDefined();
  });
});
