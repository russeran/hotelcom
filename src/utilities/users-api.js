import sendRequest from './send-request'
const BASE_URL = '/api/users'

export async function signUp(userData) {
    return sendRequest(BASE_URL, 'POST', userData)
}

export async function login(userData) {
    return sendRequest(`${BASE_URL}/login`, 'POST', userData)
}

export function checkToken() {
    return sendRequest(`${BASE_URL}/check-token`)
}

export function refreshToken() {
    return sendRequest(`${BASE_URL}/refresh-token`)
}

export function getAuditLog() {
    return sendRequest('/api/audit')
}

// Roster (name + department) for assignment dropdowns; any signed-in user.
export function getDirectory() {
    return sendRequest(`${BASE_URL}/directory`)
}

// --- Admin user management ---
export function getUsers() {
    return sendRequest(BASE_URL)
}

export function updateUserRole(userId, updates) {
    return sendRequest(`${BASE_URL}/${userId}/role`, 'PUT', updates)
}

export function deleteUser(userId) {
    return sendRequest(`${BASE_URL}/${userId}`, 'DELETE')
}

export async function uploadAvatar(formData, token) {
    // Multipart upload can't go through sendRequest (which sends JSON), so
    // use fetch directly with the auth header and a FormData body.
    const res = await fetch(`${BASE_URL}/avatar`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
    })
    if (!res.ok) throw new Error('Bad Request')
    return res.json()
}