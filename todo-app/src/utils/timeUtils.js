/**
 * Time/date utilities for the calendar grid
 */

export const START_HOUR = 7;
export const END_HOUR = 22;
export const ROW_HEIGHT = 80;
export const PIXELS_PER_MIN = ROW_HEIGHT / 60;

export function calcTop(timeStr) {
    const [hours, mins] = timeStr.split(':').map(Number);
    const totalMins = (hours - START_HOUR) * 60 + mins;
    return totalMins * PIXELS_PER_MIN;
}

export function calcHeight(startStr, endStr) {
    return calcTop(endStr) - calcTop(startStr);
}

export function timeFromPixels(px) {
    const totalMins = px / PIXELS_PER_MIN;
    const hours = Math.floor(totalMins / 60) + START_HOUR;
    const mins = Math.round(totalMins % 60 / 15) * 15; // snap to 15 min
    return `${String(hours).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
}

export function addMinutes(timeStr, minutes) {
    const [h, m] = timeStr.split(':').map(Number);
    const total = h * 60 + m + minutes;
    const newH = Math.floor(total / 60);
    const newM = total % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export function getDurationMinutes(startStr, endStr) {
    const [sh, sm] = startStr.split(':').map(Number);
    const [eh, em] = endStr.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
}

/**
 * Get the Monday of the week containing a given date
 */
export function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Get all 7 days of the week starting from Monday
 */
export function getWeekDays(mondayDate) {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(mondayDate);
        d.setDate(d.getDate() + i);
        days.push(d);
    }
    return days;
}

export const DAY_NAMES_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_NAMES_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function formatDateLabel(date) {
    return date.getDate();
}

export function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}
