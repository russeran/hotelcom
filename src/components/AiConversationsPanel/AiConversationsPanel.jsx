import { useEffect, useState } from 'react';
import { Table, Badge, Button, Modal } from 'react-bootstrap';
import * as aiConciergeAPI from '../../utilities/aiConcierge-api';
import './AiConversationsPanel.css';

function formatWhen(value) {
    const d = new Date(value);
    return isNaN(d) ? '' : d.toLocaleString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function formatDuration(seconds) {
    if (!seconds) return '—';
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export default function AiConversationsPanel() {
    const [stats, setStats] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [statsData, convsData] = await Promise.all([
                aiConciergeAPI.getStats(),
                aiConciergeAPI.getConversations({ limit: 50 })
            ]);
            setStats(statsData);
            setConversations(convsData.conversations || []);
        } catch (error) {
            console.error('Failed to load AI conversations:', error);
        } finally {
            setLoading(false);
        }
    }

    async function viewConversation(id) {
        try {
            const data = await aiConciergeAPI.getConversation(id);
            setSelectedConversation(data);
            setShowModal(true);
        } catch (error) {
            console.error('Failed to load conversation:', error);
        }
    }

    function closeModal() {
        setShowModal(false);
        setSelectedConversation(null);
    }

    if (loading) {
        return <div className="surface-card page-card">Loading AI concierge data...</div>;
    }

    return (
        <>
            <header className="page-header mt-4">
                <div>
                    <h2 className="section-title">AI Concierge Analytics</h2>
                    <p className="section-subtitle">Performance metrics and conversation history</p>
                </div>
            </header>

            {/* Stats Cards */}
            {stats && (
                <div className="ai-stats-grid">
                    <div className="ai-stat-card">
                        <div className="ai-stat-value">{stats.total}</div>
                        <div className="ai-stat-label">Total Conversations</div>
                    </div>
                    <div className="ai-stat-card">
                        <div className="ai-stat-value">{stats.verified}</div>
                        <div className="ai-stat-label">Verified Guests</div>
                        <div className="ai-stat-meta">{stats.verificationRate}% rate</div>
                    </div>
                    <div className="ai-stat-card">
                        <div className="ai-stat-value">{stats.tasksCreated}</div>
                        <div className="ai-stat-label">Tasks Created</div>
                    </div>
                    <div className="ai-stat-card">
                        <div className="ai-stat-value">{stats.complaintsLogged}</div>
                        <div className="ai-stat-label">Complaints Logged</div>
                    </div>
                    {stats.avgSatisfaction && (
                        <div className="ai-stat-card">
                            <div className="ai-stat-value">{stats.avgSatisfaction} ★</div>
                            <div className="ai-stat-label">Avg Satisfaction</div>
                        </div>
                    )}
                </div>
            )}

            {/* Intent Breakdown */}
            {stats && stats.intents && stats.intents.length > 0 && (
                <div className="surface-card page-card mt-3">
                    <h5 className="mb-3">Top Request Types</h5>
                    <div className="ai-intent-list">
                        {stats.intents.slice(0, 5).map((intent, idx) => (
                            <div key={idx} className="ai-intent-item">
                                <span className="ai-intent-name">{intent.intent || 'General'}</span>
                                <Badge bg="primary">{intent.count}</Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Conversations Table */}
            <div className="surface-card page-card mt-3">
                <h5 className="mb-3">Recent Conversations</h5>
                {conversations.length === 0 ? (
                    <div className="empty-state">No conversations yet. The AI concierge will appear here once guests start using it.</div>
                ) : (
                    <Table hover responsive className="align-middle mb-0">
                        <thead>
                            <tr>
                                <th>Started</th>
                                <th>Guest</th>
                                <th>Room</th>
                                <th>Status</th>
                                <th>Messages</th>
                                <th>Actions</th>
                                <th>Rating</th>
                                <th className="text-end">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conversations.map(conv => (
                                <tr key={conv._id}>
                                    <td className="muted">{formatWhen(conv.createdAt)}</td>
                                    <td>{conv.guestName || '—'}</td>
                                    <td>{conv.roomNumber || '—'}</td>
                                    <td>
                                        <Badge bg={
                                            conv.status === 'active' ? 'primary' :
                                            conv.status === 'completed' ? 'success' :
                                            'secondary'
                                        }>
                                            {conv.status}
                                        </Badge>
                                        {conv.verified && <Badge bg="success" className="ms-1">✓</Badge>}
                                    </td>
                                    <td>{conv.metadata?.totalMessages || 0}</td>
                                    <td>{conv.actionsTaken?.length || 0}</td>
                                    <td>
                                        {conv.satisfaction ? (
                                            <span className="text-warning">{conv.satisfaction} ★</span>
                                        ) : '—'}
                                    </td>
                                    <td className="text-end">
                                        <Button 
                                            size="sm" 
                                            variant="outline-primary"
                                            onClick={() => viewConversation(conv._id)}
                                        >
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* Conversation Detail Modal */}
            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Conversation Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedConversation && (
                        <>
                            <div className="ai-conversation-meta mb-4">
                                <div><strong>Guest:</strong> {selectedConversation.guestName || 'Not verified'}</div>
                                <div><strong>Room:</strong> {selectedConversation.roomNumber || 'N/A'}</div>
                                <div><strong>Status:</strong> <Badge bg={selectedConversation.status === 'completed' ? 'success' : 'primary'}>{selectedConversation.status}</Badge></div>
                                <div><strong>Started:</strong> {formatWhen(selectedConversation.createdAt)}</div>
                                {selectedConversation.metadata?.duration && (
                                    <div><strong>Duration:</strong> {formatDuration(selectedConversation.metadata.duration)}</div>
                                )}
                                {selectedConversation.satisfaction && (
                                    <div><strong>Rating:</strong> <span className="text-warning">{selectedConversation.satisfaction} ★</span></div>
                                )}
                            </div>

                            {selectedConversation.actionsTaken && selectedConversation.actionsTaken.length > 0 && (
                                <div className="mb-4">
                                    <h6>Actions Taken</h6>
                                    <div className="ai-actions-list">
                                        {selectedConversation.actionsTaken.map((action, idx) => (
                                            <div key={idx} className="ai-action-badge">
                                                <Badge bg="success">{action.type}</Badge>
                                                <span>{action.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <h6>Conversation</h6>
                            <div className="ai-conversation-messages">
                                {selectedConversation.messages.map((msg, idx) => (
                                    <div key={idx} className={`ai-message-detail ${msg.role}`}>
                                        <div className="ai-message-header">
                                            <strong>{msg.role === 'ai' ? '🤖 AI Concierge' : msg.role === 'guest' ? '👤 Guest' : 'ℹ️ System'}</strong>
                                            <span className="muted">{formatWhen(msg.timestamp)}</span>
                                        </div>
                                        <div className="ai-message-content">{msg.content}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
