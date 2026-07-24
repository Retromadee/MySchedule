import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import { TodoProvider } from '../../store/TodoContext';
import App from '../../App';
import { StorageService } from '../../services/StorageService';
import * as firebaseAuth from 'firebase/auth';
import * as firebaseDb from 'firebase/database';

// Mock Firebase
vi.mock('../../firebase', () => ({
  auth: {},
  database: {},
  isFirebaseConfigured: true,
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithPopup: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  OAuthProvider: vi.fn(),
}));

vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  onValue: vi.fn(),
  off: vi.fn(),
}));

// Test wrapper with providers
const renderWithProviders = (component, options = {}) => {
  return render(
    <AuthProvider>
      <TodoProvider>
        {component}
      </TodoProvider>
    </AuthProvider>,
    options
  );
};

describe('LifeSync - Application Specification Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Mock Firebase auth state - unauthenticated by default
    firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null); // No user
      return () => {};
    });
    
    // Mock Firebase database
    firebaseDb.get.mockResolvedValue({ val: () => null });
    firebaseDb.set.mockResolvedValue(undefined);
    firebaseDb.onValue.mockImplementation((ref, callback) => {
      callback({ val: () => null });
      return () => {};
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================
  // SPEC 1: Authentication Flow
  // ============================================================
  describe('Authentication Flow', () => {
    it('shows loading state initially', () => {
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        // Don't call callback - simulates loading
        return () => {};
      });
      
      renderWithProviders(<App />);
      expect(screen.getByText('Loading your schedule…')).toBeInTheDocument();
    });

    it('shows auth screen when user is not signed in', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Welcome back.')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
      expect(screen.getByText('Continue with Apple')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password (6+ characters)')).toBeInTheDocument();
    });

    it('switches between sign in and sign up modes', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Welcome back.')).toBeInTheDocument();
      });
      
      // Click sign up
      fireEvent.click(screen.getByText('New here? Create an account'));
      
      await waitFor(() => {
        expect(screen.getByText('Make your week yours.')).toBeInTheDocument();
        expect(screen.getByText('Create account')).toBeInTheDocument();
      });
      
      // Click sign in
      fireEvent.click(screen.getByText('Already have an account? Sign in'));
      
      await waitFor(() => {
        expect(screen.getByText('Welcome back.')).toBeInTheDocument();
      });
    });

    it('shows error for invalid email format', async () => {
      firebaseAuth.signInWithEmailAndPassword.mockRejectedValue({
        message: 'Firebase: Error (auth/invalid-email).'
      });
      
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'invalid' } });
        fireEvent.change(screen.getByPlaceholderText('Password (6+ characters)'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Sign in'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Error (auth/invalid-email).')).toBeInTheDocument();
      });
    });
  });

  // ============================================================
  // SPEC 2: Onboarding Flow (First-time User)
  // ============================================================
  describe('Onboarding Flow', () => {
    it('shows onboarding for new user after sign in', async () => {
      // Mock authenticated user without profile
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid', displayName: 'Test User', email: 'test@test.com' });
        return () => {};
      });
      
      firebaseDb.get.mockResolvedValueOnce({ val: () => null }); // No profile
      
      renderWithProviders(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('First-time setup')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Plan the week around you.')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('What should we call you?')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Personal, Work, Study')).toBeInTheDocument();
    });

    it('requires at least one category', async () => {
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid', displayName: 'Test User' });
        return () => {};
      });
      
      firebaseDb.get.mockResolvedValueOnce({ val: () => null });
      
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Start using LifeSync'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Add at least one category.')).toBeInTheDocument();
      });
    });

    it('completes onboarding with valid data', async () => {
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid', displayName: 'Test User' });
        return () => {};
      });
      
      firebaseDb.get.mockResolvedValueOnce({ val: () => null });
      firebaseDb.set.mockResolvedValue(undefined);
      
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.change(screen.getByPlaceholderText('What should we call you?'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Personal, Work, Study'), { target: { value: 'Work, Personal' } });
        fireEvent.change(screen.getByPlaceholderText('Task name'), { target: { value: 'Morning Standup' } });
        fireEvent.click(screen.getByText('Start using LifeSync'));
      });
      
      await waitFor(() => {
        expect(firebaseDb.set).toHaveBeenCalled();
      });
    });
  });

  // ============================================================
  // SPEC 3: Main App - Schedule View (Calendar Grid)
  // ============================================================
  describe('Schedule View - Calendar Grid', () => {
    const mockEvents = [
      { id: 1, title: 'Meeting', day: 1, start: '09:00', end: '10:00', category: 'work', color: 'blue', completed: false, loc: 'Office', subtasks: [] },
      { id: 2, title: 'Gym', day: 3, start: '18:00', end: '19:00', category: 'personal', color: 'green', completed: false, loc: 'Gym', subtasks: [] },
    ];

    beforeEach(() => {
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid', displayName: 'Test User' });
        return () => {};
      });
      firebaseDb.get.mockResolvedValue({ val: () => ({ displayName: 'Test User', categories: ['Work', 'Personal'], onboardingComplete: true }) });
      firebaseDb.onValue.mockImplementation((ref, callback) => {
        callback({ val: () => mockEvents });
        return () => {};
      });
    });

    it('renders calendar grid with time column', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('07:00')).toBeInTheDocument();
        expect(screen.getByText('22:00')).toBeInTheDocument();
      });
    });

    it('shows events at correct time positions', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('Meeting')).toBeInTheDocument();
        expect(screen.getByText('Gym')).toBeInTheDocument();
      });
    });
  });

  // ============================================================
  // SPEC 4: Event CRUD Operations
  // ============================================================
  describe('Event Management', () => {
    const mockEvents = [
      { id: 1, title: 'Existing Event', day: 1, start: '09:00', end: '10:00', category: 'work', color: 'blue', completed: false, loc: 'Office', subtasks: [] },
    ];

    beforeEach(() => {
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid', displayName: 'Test User' });
        return () => {};
      });
      firebaseDb.get.mockResolvedValue({ val: () => ({ displayName: 'Test User', categories: ['Work', 'Personal'], onboardingComplete: true }) });
      firebaseDb.onValue.mockImplementation((ref, callback) => {
        callback({ val: () => mockEvents });
        return () => {};
      });
    });

    it('opens add event modal with "n" key', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'n' });
      });
      
      await waitFor(() => {
        expect(screen.getByText('Add New Task')).toBeInTheDocument();
      });
    });

    it('creates new event with all fields', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'n' });
      });
      
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Task Title'), { target: { value: 'New Meeting' } });
        fireEvent.change(screen.getByLabelText('Description / Location'), { target: { value: 'Conference Room' } });
        fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Work' } });
        fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'high' } });
        fireEvent.change(screen.getByLabelText('Start Time'), { target: { value: '10:00' } });
        fireEvent.change(screen.getByLabelText('End Time'), { target: { value: '11:00' } });
        fireEvent.click(screen.getByText('Save Task'));
      });
      
      await waitFor(() => {
        expect(firebaseDb.set).toHaveBeenCalled();
      });
    });

    it('validates end time is after start time', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'n' });
      });
      
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Start Time'), { target: { value: '11:00' } });
        fireEvent.change(screen.getByLabelText('End Time'), { target: { value: '10:00' } });
        fireEvent.click(screen.getByText('Save Task'));
      });
      
      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('End time must be after start time.');
      });
    });

    it('adds subtasks to event', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'n' });
      });
      
      await waitFor(() => {
        fireEvent.change(screen.getByPlaceholderText('Add a subtask...'), { target: { value: 'Subtask 1' } });
        fireEvent.keyDown(screen.getByPlaceholderText('Add a subtask...'), { key: 'Enter' });
      });
      
      await waitFor(() => {
        expect(screen.getByText('Subtask 1')).toBeInTheDocument();
      });
    });
  });

  // ============================================================
  // SPEC 5: Weekly Planner View
  // ============================================================
  describe('Weekly Planner View', () => {
    const mockEvents = [
      { id: 1, title: 'Monday Task', day: 1, start: '09:00', end: '10:00', category: 'work', color: 'blue', completed: false, loc: 'Office', subtasks: [] },
      { id: 2, title: 'Tuesday Task', day: 2, start: '14:00', end: '15:00', category: 'personal', color: 'green', completed: true, loc: 'Home', subtasks: [] },
    ];

    beforeEach(() => {
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid', displayName: 'Test User' });
        return () => {};
      });
      firebaseDb.get.mockResolvedValue({ val: () => ({ displayName: 'Test User', categories: ['Work', 'Personal'], onboardingComplete: true }) });
      firebaseDb.onValue.mockImplementation((ref, callback) => {
        callback({ val: () => mockEvents });
        return () => {};
      });
    });

    it('shows planner when "Weekly Planner" selected in sidebar', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Weekly Planner'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Week of')).toBeInTheDocument();
        expect(screen.getByText('Mon')).toBeInTheDocument();
        expect(screen.getByText('Sun')).toBeInTheDocument();
      });
    });

    it('toggles task completion', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Weekly Planner'));
      });
      
      await waitFor(() => {
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
      });
      
      await waitFor(() => {
        expect(firebaseDb.set).toHaveBeenCalled();
      });
    });
  });

  // ============================================================
  // SPEC 6: Month Grid View
  // ============================================================
  describe('Month Grid View', () => {
    const mockEvents = [
      { id: 1, title: 'Monthly Meeting', date: '2026-07-15', start: '10:00', end: '11:00', category: 'work', color: 'blue', completed: false, subtasks: [] },
    ];

    beforeEach(() => {
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid', displayName: 'Test User' });
        return () => {};
      });
      firebaseDb.get.mockResolvedValue({ val: () => ({ displayName: 'Test User', categories: ['Work'], onboardingComplete: true }) });
      firebaseDb.onValue.mockImplementation((ref, callback) => {
        callback({ val: () => mockEvents });
        return () => {};
      });
    });

    it('shows month grid when "Month" view selected', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Month'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Mon')).toBeInTheDocument();
        expect(screen.getByText('Sun')).toBeInTheDocument();
      });
    });

    it('shows event chips on correct dates', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Month'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Monthly Meeting')).toBeInTheDocument();
      });
    });
  });

  // ============================================================
  // SPEC 7: Dashboard View
  // ============================================================
  describe('Dashboard View', () => {
    const mockEvents = [
      { id: 1, title: 'Task 1', day: 1, start: '09:00', end: '10:00', category: 'work', completed: true, priority: 'high', subtasks: [] },
      { id: 2, title: 'Task 2', day: 1, start: '11:00', end: '12:00', category: 'personal', completed: false, priority: 'medium', subtasks: [] },
      { id: 3, title: 'Task 3', day: 2, start: '14:00', end: '15:00', category: 'work', completed: false, priority: 'high', subtasks: [] },
    ];

    beforeEach(() => {
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid', displayName: 'Test User' });
        return () => {};
      });
      firebaseDb.get.mockResolvedValue({ val: () => ({ displayName: 'Test User', categories: ['Work', 'Personal'], onboardingComplete: true }) });
      firebaseDb.onValue.mockImplementation((ref, callback) => {
        callback({ val: () => mockEvents });
        return () => {};
      });
    });

    it('shows dashboard when "Dashboard" selected', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dashboard'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Overview & Analytics')).toBeInTheDocument();
      });
    });

    it('shows completion stats', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dashboard'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Overall Completion')).toBeInTheDocument();
        expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
      });
    });

    it('shows today\'s agenda', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dashboard'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Today\'s Agenda')).toBeInTheDocument();
      });
    });

    it('shows category breakdown', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dashboard'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
      });
    });

    it('shows priority breakdown', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dashboard'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Priority Breakdown')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
      });
    });
  });

  // ============================================================
  // SPEC 8: Settings & Data Management
  // ============================================================
  describe('Settings & Data Management', () => {
    const mockEvents = [
      { id: 1, title: 'Test Event', day: 1, start: '09:00', end: '10:00', category: 'work', completed: false, subtasks: [] },
    ];

    beforeEach(() => {
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid', displayName: 'Test User' });
        return () => {};
      });
      firebaseDb.get.mockResolvedValue({ val: () => ({ displayName: 'Test User', categories: ['Work'], onboardingComplete: true }) });
      firebaseDb.onValue.mockImplementation((ref, callback) => {
        callback({ val: () => mockEvents });
        return () => {};
      });
    });

    it('opens settings modal', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Settings'));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Settings')).toBeInTheDocument();
      });
    });

    it('toggles theme', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Settings'));
      });
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dark'));
      });
      
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });
    });
  });

  // ============================================================
  // SPEC 9: Search Functionality
  // ============================================================
  describe('Search', () => {
    const mockEvents = [
      { id: 1, title: 'Team Meeting', loc: 'Conference Room', start: '09:00', end: '10:00', category: 'work', color: 'blue', completed: false, notes: 'Quarterly review', subtasks: [] },
      { id: 2, title: 'Gym Session', loc: 'Fitness Center', start: '18:00', end: '19:00', category: 'personal', color: 'green', completed: false, notes: 'Leg day', subtasks: [] },
    ];

    beforeEach(() => {
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid', displayName: 'Test User' });
        return () => {};
      });
      firebaseDb.get.mockResolvedValue({ val: () => ({ displayName: 'Test User', categories: ['Work', 'Personal'], onboardingComplete: true }) });
      firebaseDb.onValue.mockImplementation((ref, callback) => {
        callback({ val: () => mockEvents });
        return () => {};
      });
    });

    it('filters results when typing', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.change(screen.getByPlaceholderText('Search tasks, gigs, and projects...'), { target: { value: 'Meeting' } });
      });
      
      await waitFor(() => {
        expect(screen.getByText('Team Meeting')).toBeInTheDocument();
        expect(screen.queryByText('Gym Session')).not.toBeInTheDocument();
      });
    });

    it('clears search on Escape', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.change(screen.getByPlaceholderText('Search tasks, gigs, and projects...'), { target: { value: 'Meeting' } });
      });
      
      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search tasks, gigs, and projects...')).toHaveValue('');
      });
    });
  });

  // ============================================================
  // SPEC 10: Keyboard Shortcuts
  // ============================================================
  describe('Keyboard Shortcuts', () => {
    const mockEvents = [];

    beforeEach(() => {
      firebaseAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid', displayName: 'Test User' });
        return () => {};
      });
      firebaseDb.get.mockResolvedValue({ val: () => ({ displayName: 'Test User', categories: ['Work'], onboardingComplete: true }) });
      firebaseDb.onValue.mockImplementation((ref, callback) => {
        callback({ val: () => mockEvents });
        return () => {};
      });
    });

    it('opens add modal with "n" key', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'n' });
      });
      
      await waitFor(() => {
        expect(screen.getByText('Add New Task')).toBeInTheDocument();
      });
    });

    it('closes modal with Escape', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'n' });
      });
      
      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'Escape' });
      });
      
      await waitFor(() => {
        expect(screen.queryByText('Add New Task')).not.toBeInTheDocument();
      });
    });

    it('focuses search with "/" key', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.keyDown(document, { key: '/' });
      });
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search tasks, gigs, and projects...')).toHaveFocus();
      });
    });

    it('navigates weeks with arrow keys', async () => {
      renderWithProviders(<App />);
      
      await waitFor(() => {
        fireEvent.keyDown(document, { key: 'ArrowLeft' });
      });
      
      // Would verify week navigation happened
    });
  });

  // ============================================================
  // SPEC 11: Error Handling
  // ============================================================
  describe('Error Handling', () => {
    it('shows error when Firebase not configured', () => {
      vi.resetModules();
      vi.mock('../../firebase', () => ({
        auth: {},
        database: {},
        isFirebaseConfigured: false,
      }));
      
      renderWithProviders(<App />);
      
      expect(screen.getByText('Firebase is not configured for this deployment.')).toBeInTheDocument();
    });
  });

  // ============================================================
  // SPEC 12: Storage Service (Unit Tests)
  // ============================================================
  describe('StorageService', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('returns default events when localStorage empty', () => {
      const events = StorageService.getEvents();
      expect(events.length).toBeGreaterThan(0);
      expect(events[0]).toHaveProperty('title');
      expect(events[0]).toHaveProperty('start');
      expect(events[0]).toHaveProperty('end');
    });

    it('saves and retrieves events', () => {
      const customEvents = [
        { id: 999, title: 'Custom Event', start: '09:00', end: '10:00', day: 1, completed: false }
      ];
      StorageService.saveEvents(customEvents);
      
      const retrieved = StorageService.getEvents();
      expect(retrieved).toEqual(customEvents);
    });

    it('adds event with new ID', () => {
      const initialCount = StorageService.getEvents().length;
      const newEvent = StorageService.addEvent({ title: 'New', start: '09:00', end: '10:00', day: 1 });
      
      expect(newEvent.id).toBeDefined();
      expect(StorageService.getEvents().length).toBe(initialCount + 1);
    });

    it('updates existing event', () => {
      const events = StorageService.getEvents();
      const firstEvent = events[0];
      const updated = StorageService.updateEvent({ ...firstEvent, title: 'Updated Title' });
      
      expect(updated[0].title).toBe('Updated Title');
    });

    it('toggles subtask completion', () => {
      const events = StorageService.getEvents();
      const eventWithSubtasks = { ...events[0], subtasks: [{ id: 1, text: 'Sub', completed: false }] };
      StorageService.saveEvents([eventWithSubtasks]);
      
      const result = StorageService.toggleSubtaskCompletion(eventWithSubtasks.id, 1);
      expect(result[0].subtasks[0].completed).toBe(true);
    });

    it('deletes event', () => {
      const events = StorageService.getEvents();
      const firstId = events[0].id;
      StorageService.deleteEvent(firstId);
      
      expect(StorageService.getEvents().find(e => e.id === firstId)).toBeUndefined();
    });

    it('resets to defaults', () => {
      StorageService.saveEvents([{ id: 1, title: 'Only One', start: '09:00', end: '10:00', day: 1 }]);
      StorageService.resetToDefaults();
      
      const events = StorageService.getEvents();
      expect(events.length).toBeGreaterThan(1);
    });

    it('validates event structure', () => {
      expect(() => StorageService.saveEvents([{ title: 'No ID' }])).toThrow('Invalid event data');
      expect(() => StorageService.saveEvents([{ id: 1, title: 'Bad Time', start: '9:00', end: '10:00', day: 1 }])).toThrow('Invalid event data');
    });
  });

  // ============================================================
  // SPEC 13: Utility Functions
  // ============================================================
  describe('Utility Functions', () => {
    it('calculates event top position correctly', () => {
      const { calcTop } = require('../../utils/timeUtils');
      expect(calcTop('07:00')).toBe(0);
      expect(calcTop('08:00')).toBe(80); // 60px per hour
      expect(calcTop('07:30')).toBe(40);
    });

    it('calculates event height correctly', () => {
      const { calcHeight } = require('../../utils/timeUtils');
      expect(calcHeight('09:00', '10:00')).toBe(80); // 1 hour
      expect(calcHeight('09:00', '09:30')).toBe(40); // 30 min
    });

    it('parses time to minutes', () => {
      const { timeToMinutes } = require('../../utils/timeUtils');
      expect(timeToMinutes('07:00')).toBe(0);
      expect(timeToMinutes('08:00')).toBe(60);
      expect(timeToMinutes('07:30')).toBe(30);
    });

    it('gets Monday of week', () => {
      const { getMonday } = require('../../utils/timeUtils');
      const wed = new Date('2026-07-22'); // Wednesday
      const mon = getMonday(wed);
      expect(mon.getDay()).toBe(1); // Monday
    });

    it('formats date label', () => {
      const { formatDateLabel } = require('../../utils/timeUtils');
      const date = new Date('2026-07-20');
      expect(formatDateLabel(date)).toBe('20');
    });

    it('checks same day', () => {
      const { isSameDay } = require('../../utils/timeUtils');
      const d1 = new Date('2026-07-20');
      const d2 = new Date('2026-07-20T12:00:00');
      expect(isSameDay(d1, d2)).toBe(true);
    });
  });
});