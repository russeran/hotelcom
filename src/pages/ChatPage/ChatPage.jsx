import { useEffect, useState, useRef, useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as messagesAPI from '../../utilities/messages-api';
import { getUser } from '../../utilities/users-service';
import './ChatPage.css';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);
    const user = getUser();

    const loadMessages = useCallback(async () => {
        try {
            const data = await messagesAPI.getAllMessages();
            setMessages(data);
        } catch (err) {
            console.log('Failed to load messages', err);
        }
    }, []);

    useEffect(() => {
        loadMessages();
        // Poll for new messages (consistent with the notifications approach).
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [loadMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        setSending(true);
        try {
            const newMessage = await messagesAPI.sendMessage(trimmed);
            setMessages(prev => [...prev, newMessage]);
            setText('');
        } catch (err) {
            console.log('Failed to send message', err);
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="chat-page">
            <h1 className="chat-title">TEAM CHAT</h1>
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <p className="chat-empty">No messages yet. Say hello!</p>
                ) : (
                    messages.map((m) => {
                        const mine = user && m.user === user.name;
                        return (
                            <div key={m._id} className={`chat-bubble ${mine ? 'mine' : ''}`}>
                                <span className="chat-author">{m.user}</span>
                                <span className="chat-text">{m.text}</span>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>
            <Form className="chat-form" onSubmit={handleSubmit}>
                <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Button type="submit" variant="success" disabled={sending || !text.trim()}>
                    Send
                </Button>
            </Form>
        </div>
    );
}
