// Helper utility functions

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