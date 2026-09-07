import sendRequest from './send-request';

const BASE_URL = '/api/packages';

export function getAllPackages() {
    return sendRequest(`${BASE_URL}/index`);
}

export function getPackagesByStatus(status) {
    return sendRequest(`${BASE_URL}/index?status=${status}`);
}

export function getPackage(id) {
    return sendRequest(`${BASE_URL}/${id}`);
}

export function createPackage(packageData) {
    return sendRequest(`${BASE_URL}/create`, 'POST', packageData);
}

export function updatePackage(id, updates) {
    return sendRequest(`${BASE_URL}/${id}`, 'PUT', updates);
}

export function deletePackage(id) {
    return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export function markNotified(id, method) {
    return sendRequest(`${BASE_URL}/${id}/notify`, 'POST', { method });
}

export function markPickedUp(id, signedBy) {
    return sendRequest(`${BASE_URL}/${id}/pickup`, 'POST', { signedBy });
}
