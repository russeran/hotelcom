import sendRequest from "./send-request";

const BASE_URL = "/api/reservations";

export const RESERVATION_STATUSES = ['Booked', 'Checked In', 'Checked Out', 'Cancelled'];

export function getAllReservations() {
    return sendRequest(BASE_URL);
}

export function addReservation(reservation) {
    return sendRequest(BASE_URL, "POST", reservation);
}

export function updateReservation(reservationId, updates) {
    return sendRequest(`${BASE_URL}/${reservationId}`, "PUT", updates);
}

export function deleteReservation(reservationId) {
    return sendRequest(`${BASE_URL}/${reservationId}`, "DELETE");
}
