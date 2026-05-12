const { getData } = require('./apiClient');

async function fetchWithRetry(url, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
        try {
            return await getData(url);
        } catch (error) {
            lastError = error;
        }
    }

    throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}

module.exports = { fetchWithRetry };