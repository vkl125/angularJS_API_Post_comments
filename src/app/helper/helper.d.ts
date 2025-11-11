// TypeScript declarations for helper.js module

export function delay(ms: number): Promise<void>;

export function saveToLocalStorage(key: string, data: any): boolean;

export function loadFromLocalStorage<T = any>(key: string): T | null;

export function removeFromLocalStorage(key: string): boolean;

export function formatDate(date: string | Date): string;