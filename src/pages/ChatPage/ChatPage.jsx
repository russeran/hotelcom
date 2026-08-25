import { useEffect, useState, useRef, useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as messagesAPI from '../../utilities/messages-api';
import { getUser } from '../../utilities/users-service';
import './ChatPage.css';

const CHANNELS = ['General', 'Front Desk', 'Housekeeping', 'Maintenance', 'Food & Beverage', 'Security', 'Concierge'];

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [channel, setChannel] = useState('General');
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);
    const user = getUser();

    const loadMessages = useCallback(async (ch) => {
        try {
            const data = await messagesAPI.getAllMessages(ch);
            setMessages(data);
        } catch (err) {
            console.log('Failed to load messages', err);
        }
    }, []);

    useEffect(() => {
        loadMessages(channel);
        const interval = setInterval(() => loadMessages(channel), 3000);
        return () => clearInterval(interval);
    }, [loadMessages, channel]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        setSending(true);
        try {
            const newMessage = await messagesAPI.sendMessage(trimmed, channel);
            setMessages(prev => [...prev, newMessage]);
            setText('');
        } catch (err) {
            console.log('Failed to send message', err);
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="page chat-page">
            <header className="page-header">
                <div>
                    <h1 className="section-title">Team Chat</h1>
                    <p className="section-subtitle">#{channel} · {messages.length} message{messages.length === 1 ? '' : 's'} · live</p>
                </div>
            </header>

            <div className="chat-channels">
                {CHANNELS.map(ch => (
                    <button
                        key={ch}
                        className={`chat-channel ${channel === ch ? 'active' : ''}`}
                        onClick={() => setChannel(ch)}
                    >
                        #{ch}
                    </button>
                ))}
            </div>

            <div className="chat-messages surface-card">
                {messages.length === 0 ? (
                    <p className="chat-empty">No messages in #{channel} yet. Start the conversation!</p>
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
                    placeholder={`Message #${channel}…`}
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
