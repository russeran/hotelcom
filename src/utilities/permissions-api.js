import sendRequest from './send-request';

const BASE_URL = '/api/permissions';

export function getAllPermissions(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return sendRequest(`${BASE_URL}/index${params ? '?' + params : ''}`);
}

export function getPermission(role, department) {
    const params = new URLSearchParams({ role, department: department || 'All' }).toString();
    return sendRequest(`${BASE_URL}/get?${params}`);
}

export function createPermission(permissionData) {
    return sendRequest(`${BASE_URL}/create`, 'POST', permissionData);
}

export function updatePermission(id, permissionData) {
    return sendRequest(`${BASE_URL}/${id}`, 'PUT', permissionData);
}

export function deletePermission(id) {
    return sendRequest(`${BASE_URL}/${id}`, 'DELETE');
}

export function initializeDefaults() {
    return sendRequest(`${BASE_URL}/initialize-defaults`, 'POST');
}
