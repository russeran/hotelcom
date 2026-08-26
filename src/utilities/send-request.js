import { getToken } from './users-service'
import { notifyError } from './toast'

export default async function sendRequest(url, method = 'GET', payload = null) {
    // Fetch accepts an options object as the 2nd argument
    // used to include a data payload, set headers, etc. 
    const options = { method };
    if (payload) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(payload);
    }
    const token = getToken()
    if (token) {
        // Ensure the headers object exists
        options.headers = options.headers || {}
            // Add token to an Authorization header
            // Prefacing with 'Bearer' is recommended in the HTTP specification
        options.headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(url, options);
    // res.ok will be false if the status code set to 4xx in the controller action
    if (res.ok) return res.json();

    // Surface a friendly error toast (except for auth 401s, which the app
    // handles by logging the user out).
    let message = 'Request failed';
    try {
        const body = await res.clone().json();
        if (typeof body === 'string') message = body;
        else if (body && body.message) message = body.message;
    } catch {
        message = res.statusText || message;
    }
    if (res.status !== 401) notifyError(message);
    const err = new Error(message);
    err.status = res.status;
    throw err;
}