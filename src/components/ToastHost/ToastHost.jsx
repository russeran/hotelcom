import { useEffect, useState } from 'react';
import { ToastContainer, Toast } from 'react-bootstrap';
import { subscribeToasts } from '../../utilities/toast';

export default function ToastHost() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        return subscribeToasts((toast) => {
            setToasts(prev => [...prev, toast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id));
            }, 5000);
        });
    }, []);

    function dismiss(id) {
        setToasts(prev => prev.filter(t => t.id !== id));
    }

    return (
        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 2000 }}>
            {toasts.map(t => (
                <Toast key={t.id} bg={t.variant === 'success' ? 'success' : 'danger'} onClose={() => dismiss(t.id)}>
                    <Toast.Header closeButton>
                        <strong className="me-auto">{t.variant === 'success' ? 'Success' : 'Error'}</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{t.message}</Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
}
