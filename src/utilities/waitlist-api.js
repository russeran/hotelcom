import sendRequest from './send-request';

const BASE_URL = '/api/waitlist';

export function getAllWaitlist(filters = {}) {
    const params = new URLSearchParams();
    if (filters.restaurantId) params.append('restaurantId', filters.restaurantId);
    if (filters.date) params.append('date', filters.date);
    if (filters.status) params.append('status', filters.status);
    return sendRequest(`${BASE_URL}/index?${params.toString()}`);
}

export function createWaitlistEntry(entryData) {
    return sendRequest(`${BASE_URL}/create`, 'POST', entryData);
}

export function updateWaitlistEntry(id, updates) {
    return sendRequest(`${BASE_URL}/${id}`, 'PUT', updates);
}

export function deleteWaitlistEntry(id) {
    return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export function notifyGuest(id) {
    return sendRequest(`${BASE_URL}/${id}/notify`, 'POST');
}

export function convertToReservation(id) {
    return sendRequest(`${BASE_URL}/${id}/convert`, 'POST');
}
