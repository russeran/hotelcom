import { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as aiConciergeAPI from '../../utilities/aiConcierge-api';
import './AiConciergePage.css';

export default function AiConciergePage() {
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [verified, setVerified] = useState(false);
    const [guestName, setGuestName] = useState('');
    
    // Verification form
    const [roomNumber, setRoomNumber] = useState('');
    const [lastName, setLastName] = useState('');
    const [verifying, setVerifying] = useState(false);
    
    // Satisfaction rating
    const [showSatisfaction, setShowSatisfaction] = useState(false);
    const [rating, setRating] = useState(0);
    
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Start conversation on mount
    useEffect(() => {
        async function init() {
            try {
                const data = await aiConciergeAPI.startConversation();
                setSessionId(data.sessionId);
                setMessages([{
                    role: 'ai',
                    content: data.message,
                    timestamp: new Date()
                }]);
            } catch (error) {
                console.error('Failed to start conversation:', error);
                setMessages([{
                    role: 'ai',
                    content: 'Sorry, I\'m having trouble connecting. Please refresh the page or contact the front desk.',
                    timestamp: new Date()
                }]);
            }
        }
        init();
    }, []);

    async function handleVerification(e) {
        e.preventDefault();
        if (!roomNumber || !lastName) return;
        
        setVerifying(true);
        try {
            const data = await aiConciergeAPI.verifyGuest(sessionId, roomNumber, lastName);
            
            setMessages(prev => [...prev, 
                {
                    role: 'guest',
                    content: `Room ${roomNumber}, ${lastName}`,
                    timestamp: new Date()
                },
                {
                    role: 'ai',
                    content: data.message,
                    timestamp: new Date()
                }
            ]);
            
            if (data.verified) {
                setVerified(true);
                setGuestName(data.guestName);
            }
            
            setRoomNumber('');
            setLastName('');
        } catch (error) {
            console.error('Verification error:', error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: 'Sorry, I had trouble verifying your information. Please try again.',
                timestamp: new Date()
            }]);
        } finally {
            setVerifying(false);
        }
    }

    async function handleSendMessage(e) {
        e.preventDefault();
        const text = inputText.trim();
        if (!text || !sessionId) return;

        // Add guest message
        const guestMsg = {
            role: 'guest',
            content: text,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, guestMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const data = await aiConciergeAPI.sendMessage(sessionId, text);
            
            const aiMsg = {
                role: 'ai',
                content: data.message,
                timestamp: new Date(),
                action: data.action
            };
            
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Send message error:', error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: error.message || 'Sorry, I had trouble processing that. Could you try again?',
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    }

    async function handleEndConversation() {
        setShowSatisfaction(true);
    }

    async function submitSatisfaction(selectedRating) {
        try {
            await aiConciergeAPI.endConversation(sessionId, selectedRating);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: 'Thank you for your feedback! Have a wonderful stay!',
                timestamp: new Date()
            }]);
            setShowSatisfaction(false);
            
            // Disable input after ending
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'system',
                    content: 'This conversation has ended. Refresh the page to start a new conversation.',
                    timestamp: new Date()
                }]);
            }, 2000);
        } catch (error) {
            console.error('Error ending conversation:', error);
        }
    }

    function formatTime(date) {
        return new Date(date).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit' 
        });
    }

    const needsVerification = !verified && messages.length > 1;

    return (
        <div className="ai-concierge-page">
            <div className="ai-chat-container">
                <div className="ai-chat-header">
                    <h2>🤖 AI Hotel Concierge</h2>
                    <p>{verified ? `Welcome, ${guestName}!` : 'Your 24/7 virtual assistant'}</p>
                </div>

                <div className="ai-chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`ai-message ${msg.role}`}>
                            <div className="ai-message-avatar">
                                {msg.role === 'ai' ? '🤖' : msg.role === 'system' ? 'ℹ️' : '👤'}
                            </div>
                            <div>
                                <div className="ai-message-bubble">
                                    {msg.content}
                                    {msg.action && (
                                        <div className="ai-action-badge">
                                            ✅ {msg.action.description || 'Action taken'}
                                        </div>
                                    )}
                                </div>
                                <div className="ai-message-time">{formatTime(msg.timestamp)}</div>
                            </div>
                        </div>
                    ))}
                    
                    {isTyping && (
                        <div className="ai-message ai">
                            <div className="ai-message-avatar">🤖</div>
                            <div className="ai-message-bubble">
                                <div className="ai-typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {needsVerification && !showSatisfaction && (
                        <div className="ai-verification-form">
                            <h4>🔐 Verify Your Identity</h4>
                            <p className="text-muted mb-3">To assist you better, please verify your room reservation:</p>
                            <Form onSubmit={handleVerification}>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Room Number"
                                        value={roomNumber}
                                        onChange={(e) => setRoomNumber(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    disabled={verifying}
                                    className="w-100"
                                >
                                    {verifying ? 'Verifying...' : 'Verify'}
                                </Button>
                            </Form>
                        </div>
                    )}

                    {showSatisfaction && (
                        <div className="ai-satisfaction-form">
                            <h4>How was your experience?</h4>
                            <p className="text-muted">Please rate your interaction with our AI concierge:</p>
                            <div className="ai-star-rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span 
                                        key={star}
                                        className={star <= rating ? 'filled' : ''}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setRating(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <Button 
                                variant="primary" 
                                onClick={() => submitSatisfaction(rating)}
                                disabled={rating === 0}
                            >
                                Submit Feedback
                            </Button>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {!showSatisfaction && (
                    <div className="ai-chat-input">
                        <Form onSubmit={handleSendMessage}>
                            <div className="ai-chat-input-wrapper">
                                <Form.Control
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Type your message..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    disabled={isTyping || !sessionId}
                                />
                                <Button 
                                    type="submit" 
                                    variant="primary"
                                    disabled={!inputText.trim() || isTyping || !sessionId}
                                >
                                    ➤
                                </Button>
                            </div>
                        </Form>
                        <div className="text-center mt-3">
                            <Button 
                                variant="link" 
                                size="sm"
                                onClick={handleEndConversation}
                                disabled={!sessionId || messages.length < 2}
                            >
                                End Conversation
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
