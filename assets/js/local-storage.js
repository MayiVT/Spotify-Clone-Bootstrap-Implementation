/**
 * Save data to localStorage
 * @param {string} key - The key to store the data under
 * @param {any} data - The data to store
 */
function saveToLocalStorage(key, data) {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Get data from localStorage
 * @param {string} key - The key to retrieve data from
 * @returns {any} The parsed data or null if not found
 */
function getFromLocalStorage(key) {
    try {
        const serializedData = localStorage.getItem(key);
        return serializedData ? JSON.parse(serializedData) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}
