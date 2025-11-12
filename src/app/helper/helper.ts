// Helper utility functions
import * as moment from 'moment';

export function saveToLocalStorage<T>(key: string, data: T): boolean {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.warn(`Failed to save data to localStorage for key: ${key}`, error);
        return false;
    }
}

export function loadFromLocalStorage<T>(key: string): T | null {
    try {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.warn(`Failed to load data from localStorage for key: ${key}`, error);
        return null;
    }
}

export function removeFromLocalStorage(key: string): boolean {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`Failed to remove data from localStorage for key: ${key}`, error);
        return false;
    }
}

// Date/Time helper functions using moment

export function formatDateForDisplay(date: string | Date): string {
    return moment(date).local().format("MMMM Do YYYY, h:mm:ss a");
}

export function getCurrentDateForDisplay(): string {
    return moment().local().format("MMMM Do YYYY, h:mm:ss a");
}

export function createCurrentUTCTimestamp(): string {
    return moment.utc().toISOString();
}

export function parseDisplayDateToUTC(date: string | Date): string {
    return moment(date, "MMMM Do YYYY, h:mm:ss a").utc().toISOString();
}