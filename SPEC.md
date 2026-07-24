# LifeSync — Functional Specification Document

## 1. Product Overview
**LifeSync** is a weekly planning & task management web application with Firebase-backed synchronization across devices. Built with React 19, Vite 8, and Firebase Auth/Realtime Database.

---

## 2. User Roles & Authentication

### 2.1 Authentication Methods
- **Email/Password**: Sign up & sign in (min 6 chars password)
- **Google OAuth**: One-click sign in
- **Apple OAuth**: One-click sign in (requires Apple Developer config)

### 2.2 Auth Flows
| Flow | Entry Point | Success Redirect |
|------|-------------|------------------|
| New user → Sign up | `/` (unauthenticated) | Onboarding → Main app |
| Existing user → Sign in | `/` (unauthenticated) | Main app |
| Signed in → Session restore | `/` (returning) | Main app |
| Sign out | Profile dropdown | Auth screen |

### 2.3 Protected Routes
- All app routes require valid Firebase Auth session
- Unauthenticated users see `AuthScreen` component
- Unconfigured Firebase shows "Firebase not configured" message

---

## 3. Onboarding (First-Time Users)

### 3.1 Required Fields
- **Display Name**: User's preferred name
- **Categories**: Comma-separated list (min 1, default: "Personal, Work, Study")
- **Starter Tasks**: At least 1 task with title, day (1-7), start/end time, category

### 3.2 Onboarding Completion
- Saves profile to `users/{uid}/profile` with `onboardingComplete: true`
- Seeds starter tasks to `users/{uid}/events`
- Redirects to main app

---

## 4. Core Features

### 4.1 Task/Event Management

#### Event Data Model
```typescript
interface Event {
  id: number | string;           // Unique identifier
  title: string;                 // Required
  loc?: string;                  // Location / description
  color: 'blue' | 'grey' | 'yellow' | 'white';
  day: 1-7;                      // Day of week (1=Mon, 7=Sun)
  date?: string;                 // Optional specific date (YYYY-MM-DD)
  start: string;                 // HH:MM (24hr)
  end: string;                   // HH:MM (24hr)
  icon: string;                  // Phosphor icon name
  iconColor: string;             // Hex color
  category: string;              // User-defined category
  priority: 'low' | 'medium' | 'high';
  notes?: string;                // Free-text notes
  subtasks?: Subtask[];          // Checklist items
  completed: boolean;            // Completion status
  tag?: string;                  // Optional tag label
  tagColor?: string;             // Tag color variant
}
```

#### CRUD Operations
| Operation | Trigger | Firebase Path |
|-----------|---------|---------------|
| Create | "Add Task" button / N key | `users/{uid}/events/{id}` |
| Read | App load / route change | `users/{uid}/events` (onValue listener) |
| Update | Edit modal / drag-drop / checkbox | `users/{uid}/events/{id}` |
| Delete | Detail view delete button | `users/{uid}/events/{id}` |
| Duplicate | Detail view duplicate button | New ID at `users/{uid}/events/{newId}` |

#### Validation Rules
- Title required, non-empty
- End time > Start time
- Day must be 1-7
- Date optional but must be valid YYYY-MM-DD
- Subtasks: unique IDs, text required

### 4.2 Calendar Views

#### 4.2.1 Week View (CalendarGrid)
- 7-day grid, 7:00-22:00 (16 hours)
- Hourly time slots (80px each)
- Current time line indicator
- Drag-and-drop rescheduling
- Event cards with color/category/icon

#### 4.2.2 Month View (MonthGrid)
- 6-week grid (42 cells)
- Event chips (max 3 visible + "+N more")
- Selected day detail panel
- Weekend styling

#### 4.2.3 Day View
- Single day, same hourly layout as week

#### 4.2.4 Weekly Planner
- 2-column day cards (7 days)
- Progress rings per day
- Task checkboxes with completion
- Category chips

### 4.3 Dashboard
- **Stats Row**: Completion rate, completed count, busiest day, active categories
- **Today's Agenda**: Checklist with completion toggles
- **Category Breakdown**: Progress bars per category
- **Priority Breakdown**: High/Medium/Low counts

### 4.4 Filtering & Search
- **Category Filter**: Sidebar focus areas (Housing, Projects, Music, Career, Finance)
- **Priority Filter**: All / High / Medium / Low
- **Status Filter**: All / Pending / Completed
- **Global Search**: Title, location, notes, category (real-time results)

### 4.5 Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `N` | Open add task modal |
| `Escape` | Close modals/dropdowns |
| `/` | Focus search input |
| `←` / `→` | Navigate week/month |
| `Enter` (in subtask input) | Add subtask |

---

## 5. Data Persistence

### 5.1 Firebase Realtime Database
```
users/
  {uid}/
    profile/          # User profile (displayName, categories, onboardingComplete)
    events/           # Event objects keyed by ID
```

### 5.2 Local Storage Fallback
- Used when `user === null` (unauthenticated)
- Key: `personalEvents`
- Seeded with `defaultEvents` (35 events across 8 weeks)

### 5.3 Offline Behavior
- Firebase Realtime Database has native offline persistence
- Local storage for unauthenticated users
- No explicit Service Worker (PWA not implemented)

---

## 6. UI/UX Specifications

### 6.1 Theming
- **Light**: Warm cream background (`#f7f4eb`), dark sidebar
- **Dark**: Near-black (`#0d0d0d`), dark sidebar
- Toggle persists in `localStorage` (`lifesync_theme`)
- CSS variable system for all colors

### 6.2 Responsive Breakpoints
- **Desktop** (>768px): Full sidebar, multi-column layouts
- **Tablet** (≤768px): Collapsible drawer sidebar, stacked layouts
- **Mobile** (≤480px): Single-column, reduced padding

### 6.3 Component States
| Component | Loading | Empty | Error | Success |
|-----------|---------|-------|-------|---------|
| Auth | Spinner | N/A | Inline error | Redirect |
| Events | Skeleton | "No tasks" | Toast | Optimistic UI |
| Import/Export | Spinner | N/A | "Invalid file" | Toast badge |

---

## 7. Settings & Data Management

### 7.1 Settings Modal
- **Theme Toggle**: Light / Dark
- **Export Data**: Download `lifesync_backup.json` (allEvents)
- **Import Data**: Upload JSON → replaces events (awaits Firebase write)
- **Reset Data**: Confirm → restore `defaultEvents`

### 7.2 Profile Dropdown
- User initials avatar (from displayName/email)
- Stats: Total tasks, Completed, Completion rate
- Settings & Sign out actions

---

## 8. Notifications
- Browser Notification API
- Checks every 60s for events starting in 5 minutes
- Requests permission on first load

---

## 9. Acceptance Criteria (Test Scenarios)

### 9.1 Authentication
- [ ] New user can sign up with email/password
- [ ] New user can sign up with Google
- [ ] Existing user can sign in
- [ ] Invalid credentials show error
- [ ] Sign out returns to auth screen
- [ ] Session persists on refresh

### 9.2 Onboarding
- [ ] Name required
- [ ] At least 1 category required
- [ ] At least 1 starter task required
- [ ] Completing onboarding seeds events to Firebase
- [ ] Returning user skips onboarding

### 9.3 Event CRUD
- [ ] Create event with all fields
- [ ] Edit event updates Firebase
- [ ] Delete event removes from Firebase
- [ ] Duplicate creates new ID
- [ ] Validation: end > start, title required
- [ ] Subtasks add/remove work

### 9.4 Views
- [ ] Week view shows 7 days, 16 hours
- [ ] Month view shows 6 weeks
- [ ] Day view shows single day
- [ ] Weekly planner shows progress rings
- [ ] Drag-drop reschedules (week view)
- [ ] Current time line visible

### 9.5 Filtering & Search
- [ ] Category filter narrows events
- [ ] Priority filter works
- [ ] Status filter works
- [ ] Search finds by title/loc/notes/category
- [ ] Clear filter resets view

### 9.6 Data Management
- [ ] Export downloads valid JSON
- [ ] Import replaces events in Firebase
- [ ] Import shows success/error toast
- [ ] Reset restores defaults

### 9.7 Theming
- [ ] Light theme renders correctly
- [ ] Dark theme renders correctly
- [ ] Toggle persists on refresh

### 9.8 Keyboard Shortcuts
- [ ] `N` opens modal
- [ ] `Escape` closes modal
- [ ] `/` focuses search
- [ ] Arrow keys navigate calendar

### 9.9 Responsive
- [ ] Sidebar collapses on mobile
- [ ] Layout stacks on tablet
- [ ] Touch targets adequate

---

## 10. Non-Functional Requirements

### 10.1 Performance
- Initial load < 3s (Vercel + Vite)
- Bundle: main < 80KB gzipped
- Interactions < 100ms

### 10.2 Security
- Firebase rules: users only access own data
- No secrets in client bundle
- HTTPS only (Vercel)

### 10.3 Accessibility
- Semantic HTML
- Focus visible
- ARIA labels on icon buttons
- Color contrast (WCAG AA)

### 10.4 Browser Support
- Chrome 120+, Firefox 120+, Safari 17+, Edge 120+

---

## 11. Known Limitations / Future Work
- No recurring events
- No shared calendars
- No file attachments
- No PWA/offline-first (Service Worker)
- No analytics
- No email reminders (only browser notifications)
- Apple Sign-In requires Apple Developer account config