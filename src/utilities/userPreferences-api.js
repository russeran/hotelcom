import sendRequest from './send-request';

const BASE_URL = '/api/user-preferences';

export function getPreferences() {
    return sendRequest(BASE_URL);
}

export function updatePreferences(preferences) {
    return sendRequest(BASE_URL, 'PUT', preferences);
}

export function resetDashboard() {
    return sendRequest(`${BASE_URL}/reset-dashboard`, 'POST');
}
