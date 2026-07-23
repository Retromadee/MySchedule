export function toDateKey(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export function getWeekdayIndex(date) {
    return date.getDay() || 7;
}

export function matchesDate(event, date) {
    return event.date
        ? event.date === toDateKey(date)
        : event.day === getWeekdayIndex(date);
}

export function eventsForDate(events, date) {
    return events.filter(event => matchesDate(event, date));
}

export function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
