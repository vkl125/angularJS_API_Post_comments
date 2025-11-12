// Helper utility functions

export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}