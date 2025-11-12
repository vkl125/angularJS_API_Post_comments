// Type declarations for helper functions

export function delay(ms: number): Promise<void>;
export function saveToLocalStorage<T>(key: string, data: T): boolean;
export function loadFromLocalStorage<T>(key: string): T | null;
export function removeFromLocalStorage(key: string): boolean;
export function formatDate(date: Date | string): string;
export function generateId(): number;
export function validateEmail(email: string): boolean;

// Date/Time helper functions using moment
export function formatDateForDisplay(date: string | Date): string;
export function getCurrentDateForDisplay(): string;
export function createCurrentUTCTimestamp(): string;
export function parseDisplayDateToUTC(date: string | Date): string;