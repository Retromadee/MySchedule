import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

// Mock the context hook
vi.mock('../../store/TodoContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTodo: () => ({
      events: [
        { id: 1, title: 'Music practice', day: new Date().getDay() === 0 ? 7 : new Date().getDay(), start: '09:00', end: '10:00', completed: false, category: 'music', priority: 'high' },
        { id: 2, title: 'Housing paperwork', day: new Date().getDay() === 0 ? 7 : new Date().getDay(), start: '10:00', end: '11:00', completed: true, category: 'housing', priority: 'medium' }
      ],
      toggleEventCompletion: vi.fn()
    })
  };
});

describe('Dashboard Component', () => {
  it('renders stats correctly', () => {
    render(<Dashboard />);
    
    // Check completion rate: 1 out of 2 completed => 50%
    const completionEl = screen.getByText('50%');
    expect(completionEl).toBeDefined();

    // Check headers
    expect(screen.getByText("Overview & Analytics")).toBeDefined();
    expect(screen.getByText("Today's Agenda")).toBeDefined();

    // Check categories breakdown
    expect(screen.getByText("Category Breakdown")).toBeDefined();
    expect(screen.getByText("music")).toBeDefined();
    expect(screen.getByText("housing")).toBeDefined();
  });
});
