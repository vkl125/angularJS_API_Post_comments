// Helper utility functions

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.warn(`Failed to save data to localStorage for key: ${key}`, error);
        return false;
    }
}

export function loadFromLocalStorage(key) {
    try {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.warn(`Failed to load data from localStorage for key: ${key}`, error);
        return null;
    }
}

export function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`Failed to remove data from localStorage for key: ${key}`, error);
        return false;
    }
}

export function formatDate(date) {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

