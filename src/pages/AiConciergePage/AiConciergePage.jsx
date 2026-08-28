import { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as aiConciergeAPI from '../../utilities/aiConcierge-api';
import './AiConciergePage.css';

export default function AiConciergePage() {
    const [showWelcome, setShowWelcome] = useState(true);
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

    // Start conversation when user clicks to start
    async function startChat(quickAction = null) {
        setShowWelcome(false);
        try {
            const data = await aiConciergeAPI.startConversation();
            setSessionId(data.sessionId);
            const initialMessages = [{
                role: 'ai',
                content: data.message,
                timestamp: new Date()
            }];
            
            // If quick action selected, automatically send it
            if (quickAction) {
                initialMessages.push({
                    role: 'guest',
                    content: quickAction,
                    timestamp: new Date()
                });
                setMessages(initialMessages);
                setIsTyping(true);
                
                // Send the quick action message to AI
                try {
                    const response = await aiConciergeAPI.sendMessage(data.sessionId, quickAction);
                    setMessages(prev => [...prev, {
                        role: 'ai',
                        content: response.message,
                        timestamp: new Date(),
                        action: response.action
                    }]);
                } catch (error) {
                    console.error('Quick action error:', error);
                } finally {
                    setIsTyping(false);
                }
            } else {
                setMessages(initialMessages);
            }
        } catch (error) {
            console.error('Failed to start conversation:', error);
            setMessages([{
                role: 'ai',
                content: 'Sorry, I\'m having trouble connecting. Please refresh the page or contact the front desk.',
                timestamp: new Date()
            }]);
        }
    }

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

    // Welcome Screen
    if (showWelcome) {
        return (
            <div className="ai-concierge-page">
                <div className="ai-welcome-container">
                    <div className="ai-welcome-hero">
                        <div className="ai-welcome-icon">🤖</div>
                        <h1>AI Hotel Concierge</h1>
                        <p className="ai-welcome-subtitle">Your personal 24/7 virtual assistant</p>
                        
                        <div className="ai-welcome-features">
                            <div className="ai-feature-badge">
                                <span className="ai-feature-icon">⚡</span>
                                <span>Instant Response</span>
                            </div>
                            <div className="ai-feature-badge">
                                <span className="ai-feature-icon">🔒</span>
                                <span>Secure & Private</span>
                            </div>
                            <div className="ai-feature-badge">
                                <span className="ai-feature-icon">🌟</span>
                                <span>24/7 Available</span>
                            </div>
                        </div>

                        <Button 
                            size="lg" 
                            variant="primary" 
                            className="ai-start-chat-btn"
                            onClick={() => startChat()}
                        >
                            Start Conversation
                        </Button>
                    </div>

                    <div className="ai-quick-actions-section">
                        <h3>Quick Actions</h3>
                        <p className="text-muted mb-4">Or get started with a common request:</p>
                        
                        <div className="ai-quick-actions-grid">
                            <button className="ai-quick-action-card" onClick={() => startChat("I need extra towels in my room")}>
                                <span className="ai-quick-icon">🛁</span>
                                <h4>Request Housekeeping</h4>
                                <p>Towels, cleaning, amenities</p>
                            </button>
                            
                            <button className="ai-quick-action-card" onClick={() => startChat("Something in my room needs repair")}>
                                <span className="ai-quick-icon">🔧</span>
                                <h4>Report an Issue</h4>
                                <p>AC, plumbing, electrical</p>
                            </button>
                            
                            <button className="ai-quick-action-card" onClick={() => startChat("What's the WiFi password?")}>
                                <span className="ai-quick-icon">📶</span>
                                <h4>Hotel Information</h4>
                                <p>WiFi, amenities, policies</p>
                            </button>
                            
                            <button className="ai-quick-action-card" onClick={() => startChat("Can you recommend a restaurant nearby?")}>
                                <span className="ai-quick-icon">🍽️</span>
                                <h4>Local Recommendations</h4>
                                <p>Restaurants, attractions, transport</p>
                            </button>
                        </div>
                    </div>

                    <div className="ai-welcome-stats">
                        <div className="ai-stat">
                            <div className="ai-stat-value">24/7</div>
                            <div className="ai-stat-label">Always Available</div>
                        </div>
                        <div className="ai-stat">
                            <div className="ai-stat-value">&lt;30s</div>
                            <div className="ai-stat-label">Average Response</div>
                        </div>
                        <div className="ai-stat">
                            <div className="ai-stat-value">98%</div>
                            <div className="ai-stat-label">Guest Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Chat Interface
    return (
        <div className="ai-concierge-page">
            <div className="ai-chat-container">
                <div className="ai-chat-header">
                    <button className="ai-back-btn" onClick={() => { setShowWelcome(true); setMessages([]); setSessionId(null); }}>
                        ← Back
                    </button>
                    <div>
                        <h2>🤖 AI Hotel Concierge</h2>
                        <p>{verified ? `Welcome, ${guestName}!` : 'Your 24/7 virtual assistant'}</p>
                    </div>
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
