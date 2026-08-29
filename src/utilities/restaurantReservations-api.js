import sendRequest from './send-request';

const BASE_URL = '/api/restaurant-reservations';

export function getAllReservations(filters = {}) {
    const params = new URLSearchParams();
    if (filters.restaurantId) params.append('restaurantId', filters.restaurantId);
    if (filters.date) params.append('date', filters.date);
    if (filters.status) params.append('status', filters.status);
    return sendRequest(`${BASE_URL}/index?${params.toString()}`);
}

export function getReservation(id) {
    return sendRequest(`${BASE_URL}/${id}`);
}

export function createReservation(reservationData) {
    return sendRequest(`${BASE_URL}/create`, 'POST', reservationData);
}

export function updateReservation(id, updates) {
    return sendRequest(`${BASE_URL}/${id}`, 'PUT', updates);
}

export function deleteReservation(id) {
    return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export function updateStatus(id, status) {
    return sendRequest(`${BASE_URL}/${id}/status`, 'POST', { status });
}

export function checkAvailability(restaurantId, date, time, partySize) {
    const params = new URLSearchParams({ restaurantId, date, time, partySize });
    return sendRequest(`${BASE_URL}/check-availability?${params.toString()}`);
}
