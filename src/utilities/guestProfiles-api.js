import sendRequest from './send-request';

const BASE_URL = '/api/guest-profiles';

export function getAllProfiles() {
    return sendRequest(`${BASE_URL}/index`);
}

export function getProfile(id) {
    return sendRequest(`${BASE_URL}/${id}`);
}

export function searchProfiles(query) {
    return sendRequest(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
}

export function createProfile(profileData) {
    return sendRequest(`${BASE_URL}/create`, 'POST', profileData);
}

export function updateProfile(id, updates) {
    return sendRequest(`${BASE_URL}/${id}`, 'PUT', updates);
}

export function deleteProfile(id) {
    return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export function addNote(id, note) {
    return sendRequest(`${BASE_URL}/${id}/notes`, 'POST', { note });
}
