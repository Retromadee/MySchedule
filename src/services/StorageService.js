const defaultEvents = [
    { id: 1, day: 1, start: '08:00', end: '10:00', title: 'Apartment Hunting', loc: 'Viewings (Budget: £350)', color: 'blue', icon: 'House', iconColor: '#4d72d6', category: 'housing', completed: false, priority: 'high', notes: 'Check listings on Rightmove & Zoopla. Budget max £350/month. Look for places near campus.' },
    { id: 2, day: 1, start: '10:15', end: '11:30', title: 'Mahir App Dev', loc: 'Bulk SMS Logic', color: 'grey', icon: 'Code', iconColor: '#333', category: 'projects', completed: false, priority: 'medium', notes: 'Implement company category filtering for bulk SMS dispatch. Reference Twilio API docs.' },
    { id: 3, day: 2, start: '07:30', end: '09:00', title: 'Study Grind', loc: 'Check sources', color: 'yellow', icon: 'BookOpen', iconColor: '#000', category: 'finance', completed: false, priority: 'high', notes: 'Review lecture notes. Check scholarship portal for updates.' },
    { id: 4, day: 2, start: '09:30', end: '11:00', title: 'Uni Agency Work', loc: 'Recruit & Follow-ups', color: 'white', tag: 'Scholarships', tagColor: 'blue', category: 'projects', completed: false, priority: 'low', notes: 'Follow up with 3 prospective students. Update scholarship database spreadsheet.' },
    { id: 5, day: 3, start: '08:00', end: '09:30', title: 'Studio Session', loc: 'Meet with Ed, Slim, Jamal...', color: 'grey', icon: 'Headphones', iconColor: '#333', hasJoinDark: true, category: 'music', completed: false, priority: 'high', notes: 'Session at Downtown Studio. Bring USB with beats. Discuss tracklist order.' },
    { id: 6, day: 3, start: '09:45', end: '10:30', title: 'Admin & Finance', loc: 'Remind Manun for Eagles Gig Pay', color: 'blue', icon: 'Wallet', iconColor: '#4d72d6', category: 'finance', completed: false, priority: 'medium', notes: 'Send WhatsApp reminder to Manun. Check if school fees installment is due.' },
    { id: 7, day: 4, start: '07:00', end: '09:00', title: 'Mahir App Dev', loc: 'Company Categories SMS', color: 'grey', icon: 'Code', iconColor: '#333', category: 'projects', completed: false, priority: 'high', notes: 'Build the directory category UI. Pharmacy, Electronics, etc. Test with dummy data.' },
    { id: 8, day: 4, start: '09:30', end: '11:00', title: 'Job Apps', loc: 'Apply at CIFA & Internship', color: 'white', tag: 'Career', tagColor: 'pink', category: 'career', completed: false, priority: 'medium', notes: 'Update CV with latest projects. Submit CIFA application before deadline.' },
    { id: 9, day: 5, start: '08:00', end: '09:30', title: 'GQOM Promo', loc: 'Video shoot & biography outline', color: 'yellow', icon: 'VideoCamera', iconColor: '#000', category: 'music', completed: false, priority: 'medium', notes: 'Shoot aesthetic DJ content for socials. Write artist biography draft.' },
    { id: 10, day: 5, start: '10:00', end: '11:30', title: 'Event Planning', loc: 'Gigs with Sly, Miro, Nitefreak', color: 'blue', icon: 'CalendarStar', iconColor: '#4d72d6', category: 'music', completed: false, priority: 'low', notes: 'Confirm venue for next month. Reach out to Nitefreak management.' },
    { id: 11, day: 6, start: '08:00', end: '10:00', title: 'Cleaning & Washing', loc: 'Home', color: 'grey', icon: 'Broom', iconColor: '#333', category: 'career', completed: false, priority: 'low', notes: 'Deep clean before apartment move. Laundry day.' },
    { id: 12, day: 6, start: '10:30', end: '11:30', title: 'Music Collab', loc: 'Pending track with Pex Worst', color: 'white', tag: 'Studio', tagColor: 'purple', category: 'music', completed: false, priority: 'medium', notes: 'Finish vocals on the pending track. Send stems to Pex for mixing.' },
];

const STORAGE_KEY = 'personalEvents';

export const StorageService = {
    getEvents: () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error("Failed to parse local storage events", e);
        }
        StorageService.saveEvents(defaultEvents);
        return [...defaultEvents];
    },

    saveEvents: (events) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    },

    addEvent: (event) => {
        const events = StorageService.getEvents();
        event.id = Date.now();
        events.push(event);
        StorageService.saveEvents(events);
        return event;
    },

    updateEvent: (updatedEvent) => {
        const events = StorageService.getEvents();
        const idx = events.findIndex(e => e.id === updatedEvent.id);
        if (idx !== -1) {
            events[idx] = { ...events[idx], ...updatedEvent };
            StorageService.saveEvents(events);
        }
        return events;
    },

    deleteEvent: (eventId) => {
        let events = StorageService.getEvents();
        events = events.filter(e => e.id !== eventId);
        StorageService.saveEvents(events);
        return events;
    },

    resetToDefaults: () => {
        StorageService.saveEvents(defaultEvents);
        return [...defaultEvents];
    }
};
