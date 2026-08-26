import { useEffect, useState, useRef, useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as messagesAPI from '../../utilities/messages-api';
import { getUser } from '../../utilities/users-service';
import { onSocket } from '../../utilities/socket';
import './ChatPage.css';

const CHANNELS = ['General', 'Front Desk', 'Housekeeping', 'Maintenance', 'Food & Beverage', 'Security', 'Concierge'];

const SEEN_KEY = 'chat_last_seen';
function loadSeen() {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || {}; } catch { return {}; }
}
function saveSeen(seen) {
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
}

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [channel, setChannel] = useState('General');
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [summary, setSummary] = useState([]);
    const [seen, setSeen] = useState(loadSeen);
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

    const loadSummary = useCallback(async () => {
        try {
            setSummary(await messagesAPI.getChannelSummary());
        } catch { /* non-fatal */ }
    }, []);

    useEffect(() => {
        loadMessages(channel);
        loadSummary();
        // Real-time: append incoming messages for the active channel and refresh
        // the summary (for unread dots). Slow interval remains as a fallback.
        const off = onSocket('chat:new', (msg) => {
            loadSummary();
            if (msg.channel === channel) {
                setMessages(prev => (prev.some(m => m._id === msg._id) ? prev : [...prev, msg]));
            }
        });
        const interval = setInterval(() => { loadMessages(channel); loadSummary(); }, 20000);
        return () => { off(); clearInterval(interval); };
    }, [loadMessages, loadSummary, channel]);

    // Mark the active channel as seen whenever its messages update.
    useEffect(() => {
        setSeen(prev => {
            const next = { ...prev, [channel]: Date.now() };
            saveSeen(next);
            return next;
        });
    }, [channel, messages]);

    function hasUnread(ch) {
        const s = summary.find(x => x.channel === ch);
        if (!s || !s.latest) return false;
        if (ch === channel) return false;
        return new Date(s.latest).getTime() > (seen[ch] || 0);
    }

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
                        {hasUnread(ch) && <span className="chat-unread-dot" />}
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
