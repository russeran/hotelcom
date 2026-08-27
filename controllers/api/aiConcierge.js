const AiConversation = require('../../models/aiConversation');
const Reservation = require('../../models/reservation');
const Task = require('../../models/task');
const Complaint = require('../../models/complaint');
const { generateResponse, classifyIntent } = require('../../config/aiService');
const { randomUUID } = require('crypto');
const { record } = require('./audit');

/**
 * Start a new AI conversation session
 */
async function startConversation(req, res) {
    const sessionId = randomUUID();
    
    const conversation = await AiConversation.create({
        sessionId,
        status: 'active',
        messages: [{
            role: 'ai',
            content: 'Hello! I\'m your hotel AI concierge. How can I help you today?'
        }]
    });

    res.json({
        sessionId,
        conversationId: conversation._id,
        message: 'Hello! I\'m your hotel AI concierge. How can I help you today?'
    });
}

/**
 * Verify guest identity using room number and last name
 */
async function verifyGuest(req, res) {
    const { sessionId, roomNumber, lastName } = req.body;

    if (!sessionId || !roomNumber || !lastName) {
        return res.status(400).json({ error: 'Session ID, room number, and last name are required' });
    }

    // Find conversation
    const conversation = await AiConversation.findOne({ sessionId });
    if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
    }

    // Find reservation - look for checked-in guests
    const reservation = await Reservation.findOne({
        room: roomNumber,
        status: 'Checked In'
    });

    if (!reservation) {
        conversation.messages.push({
            role: 'system',
            content: `Guest verification failed: Room ${roomNumber} not found or not checked in`
        });
        await conversation.save();

        return res.json({
            verified: false,
            message: 'I couldn\'t find a guest checked into that room. Please verify your room number and try again, or I can transfer you to the front desk.'
        });
    }

    // Verify last name (case-insensitive partial match for flexibility)
    const guestLastName = reservation.guestName.split(' ').pop().toLowerCase();
    if (!guestLastName.includes(lastName.toLowerCase())) {
        conversation.messages.push({
            role: 'system',
            content: `Guest verification failed: Last name mismatch for room ${roomNumber}`
        });
        await conversation.save();

        return res.json({
            verified: false,
            message: 'The last name doesn\'t match our records for that room. Please try again or request to speak with the front desk.'
        });
    }

    // Verification successful
    conversation.verified = true;
    conversation.guestName = reservation.guestName;
    conversation.roomNumber = roomNumber;
    conversation.reservationId = reservation._id;
    
    conversation.messages.push({
        role: 'system',
        content: `Guest verified: ${reservation.guestName} in room ${roomNumber}`
    });
    
    await conversation.save();

    res.json({
        verified: true,
        guestName: reservation.guestName,
        message: `Thank you, ${reservation.guestName.split(' ')[0]}! How can I assist you today?`,
        checkOut: reservation.checkOut
    });
}

/**
 * Process a chat message from the guest
 */
async function chat(req, res) {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
        return res.status(400).json({ error: 'Session ID and message are required' });
    }

    // Find conversation
    const conversation = await AiConversation.findOne({ sessionId }).populate('reservationId');
    if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found. Please start a new session.' });
    }

    // Add guest message to conversation
    conversation.messages.push({
        role: 'guest',
        content: message
    });

    // Classify intent if this is the first substantive message
    if (conversation.messages.length === 2 && !conversation.metadata.intent) {
        conversation.metadata.intent = classifyIntent(message);
    }

    // Build context for AI
    const context = {
        verified: conversation.verified,
        guestName: conversation.guestName,
        roomNumber: conversation.roomNumber,
        checkOut: conversation.reservationId?.checkOut
    };

    try {
        // Generate AI response
        const { response, action } = await generateResponse(conversation.messages, context);

        // Add AI response to conversation
        conversation.messages.push({
            role: 'ai',
            content: response
        });

        // Handle action if present
        let actionResult = null;
        if (action && conversation.verified) {
            actionResult = await executeAction(action, conversation, req);
            
            if (actionResult) {
                conversation.actionsTaken.push({
                    type: actionResult.type,
                    entityId: actionResult.entityId,
                    description: actionResult.description
                });
            }
        }

        // Update metadata
        conversation.metadata.totalMessages = conversation.messages.length;
        await conversation.save();

        res.json({
            message: response,
            action: actionResult,
            conversationId: conversation._id
        });

    } catch (error) {
        console.error('Chat error:', error);
        
        // Add error to conversation for debugging
        conversation.messages.push({
            role: 'system',
            content: `Error: ${error.message}`
        });
        await conversation.save();

        res.status(500).json({
            error: error.message,
            message: 'I\'m having trouble processing your request. Would you like me to transfer you to a staff member?'
        });
    }
}

/**
 * Execute an action identified by the AI (create task, complaint, etc.)
 */
async function executeAction(action, conversation, req) {
    const { type, department, priority, description } = action;

    try {
        if (type === 'task') {
            // Create a task
            const task = await Task.create({
                task: description,
                department,
                priority: priority || 'Normal',
                room: conversation.roomNumber ? parseInt(conversation.roomNumber) : null,
                user: conversation.guestName || 'AI Concierge Guest',
                status: 'Open'
            });

            // Record in audit log
            await record({
                req,
                action: 'create',
                entity: 'task',
                entityId: task._id,
                details: `AI Concierge created task for room ${conversation.roomNumber}`
            });

            return {
                type: 'task',
                entityId: task._id,
                description: `Created ${priority} priority task for ${department}`
            };

        } else if (type === 'complaint') {
            // Create a complaint
            const complaint = await Complaint.create({
                issue: description,
                department: department || 'Front Desk',
                room: conversation.roomNumber ? parseInt(conversation.roomNumber) : null,
                name: conversation.guestName || 'AI Concierge Guest',
                status: 'Open'
            });

            // Record in audit log
            await record({
                req,
                action: 'create',
                entity: 'complaint',
                entityId: complaint._id,
                details: `AI Concierge logged complaint for room ${conversation.roomNumber}`
            });

            return {
                type: 'complaint',
                entityId: complaint._id,
                description: `Logged complaint for ${department}`
            };

        } else if (type === 'info') {
            // Just informational, no action needed
            return {
                type: 'information',
                description: 'Provided information to guest'
            };
        }

    } catch (error) {
        console.error('Error executing action:', error);
        return null;
    }

    return null;
}

/**
 * End a conversation
 */
async function endConversation(req, res) {
    const { sessionId, satisfaction } = req.body;

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }

    const conversation = await AiConversation.findOne({ sessionId });
    if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
    }

    conversation.status = 'completed';
    if (satisfaction) {
        conversation.satisfaction = satisfaction;
    }

    // Calculate duration
    const firstMessage = conversation.messages[0];
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    conversation.metadata.duration = Math.floor(
        (lastMessage.timestamp - firstMessage.timestamp) / 1000
    );

    await conversation.save();

    res.json({ message: 'Thank you for using our AI concierge service!', conversationId: conversation._id });
}

/**
 * Get all conversations (admin only)
 */
async function getConversations(req, res) {
    const { limit = 50, skip = 0, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const conversations = await AiConversation.find(filter)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .select('-messages'); // Don't send full messages in list view

    const total = await AiConversation.countDocuments(filter);

    res.json({
        conversations,
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
    });
}

/**
 * Get a single conversation by ID (admin only)
 */
async function getConversation(req, res) {
    const { id } = req.params;

    const conversation = await AiConversation.findById(id)
        .populate('reservationId')
        .populate('actionsTaken.entityId');

    if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
}

/**
 * Get AI concierge statistics (admin only)
 */
async function getStats(req, res) {
    const totalConversations = await AiConversation.countDocuments();
    const activeConversations = await AiConversation.countDocuments({ status: 'active' });
    const verifiedConversations = await AiConversation.countDocuments({ verified: true });
    const completedConversations = await AiConversation.countDocuments({ status: 'completed' });

    // Count actions taken
    const tasksCreated = await AiConversation.countDocuments({
        'actionsTaken.type': 'task'
    });
    const complaintsLogged = await AiConversation.countDocuments({
        'actionsTaken.type': 'complaint'
    });

    // Average satisfaction (if available)
    const satisfactionData = await AiConversation.aggregate([
        { $match: { satisfaction: { $exists: true, $ne: null } } },
        { $group: { _id: null, avgSatisfaction: { $avg: '$satisfaction' } } }
    ]);

    // Intent breakdown
    const intents = await AiConversation.aggregate([
        { $match: { 'metadata.intent': { $exists: true } } },
        { $group: { _id: '$metadata.intent', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    res.json({
        total: totalConversations,
        active: activeConversations,
        completed: completedConversations,
        verified: verifiedConversations,
        verificationRate: totalConversations > 0 ? ((verifiedConversations / totalConversations) * 100).toFixed(1) : 0,
        tasksCreated,
        complaintsLogged,
        avgSatisfaction: satisfactionData.length > 0 ? satisfactionData[0].avgSatisfaction.toFixed(2) : null,
        intents: intents.map(i => ({ intent: i._id, count: i.count }))
    });
}

module.exports = {
    startConversation,
    verifyGuest,
    chat,
    endConversation,
    getConversations,
    getConversation,
    getStats
};
