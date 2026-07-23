import { useTodo } from '../store/TodoContext';
import { eventsForDate, timeToMinutes } from '../utils/eventUtils';

export function useNotificationCount() {
    const { allEvents } = useTodo();
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return eventsForDate(allEvents, now).filter(event =>
        !event.completed && (
            timeToMinutes(event.start) > nowMinutes ||
            timeToMinutes(event.end) < nowMinutes
        )
    ).length;
}
