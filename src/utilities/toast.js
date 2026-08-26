// Tiny pub/sub used to surface app-wide toast messages without threading a
// callback through every component.
const listeners = new Set();
let seq = 0;

export function subscribeToasts(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
}

function emit(message, variant) {
    const toast = { id: ++seq, message, variant };
    listeners.forEach(cb => cb(toast));
}

export function notifyError(message) {
    emit(message || 'Something went wrong', 'danger');
}

export function notifySuccess(message) {
    emit(message, 'success');
}
