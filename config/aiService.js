const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// System prompt that defines the AI concierge's behavior
const SYSTEM_PROMPT = `You are a helpful hotel AI concierge assistant. Your role is to help hotel guests with their requests and route issues to the appropriate departments.

IMPORTANT RULES:
1. Always be polite, professional, and empathetic
2. Keep responses concise (2-3 sentences max)
3. When guests report issues, acknowledge the problem and assure them it will be handled
4. For maintenance issues (AC, plumbing, electrical, etc.) → route to "Maintenance" department
5. For housekeeping requests (towels, cleaning, amenities) → route to "Housekeeping" department
6. For noise complaints or guest conflicts → route to "Front Desk" department with HIGH priority
7. For food/beverage requests → route to "F&B" (Food & Beverage) department
8. For concierge services (recommendations, bookings, directions) → provide helpful information
9. For reservation changes (extend stay, early checkout, room change) → handle if possible or escalate
10. If you cannot help, offer to transfer to a staff member

PRIORITY LEVELS:
- "Urgent": Safety issues, major complaints, guest conflicts
- "High": Broken equipment, service failures, urgent requests
- "Normal": Standard maintenance, housekeeping requests
- "Low": Minor issues, informational requests

DEPARTMENTS:
- Maintenance: AC, plumbing, electrical, locks, appliances
- Housekeeping: Cleaning, towels, linens, amenities
- Front Desk: Check-in/out, reservations, complaints, general inquiries
- F&B: Room service, restaurant reservations, dietary requests
- Concierge: Local recommendations, transportation, activities

When you identify an actionable request, respond with a JSON object at the END of your message in this format:
{ACTION: {"type": "task"|"complaint"|"info", "department": "dept_name", "priority": "Low|Normal|High|Urgent", "description": "brief description"}}

Example responses:
- "I'm sorry to hear the AC isn't working. I've notified our maintenance team and they'll be there within 30 minutes. {ACTION: {"type": "task", "department": "Maintenance", "priority": "High", "description": "AC not working"}}"
- "I apologize for the noise disturbance. I'm escalating this to our front desk manager immediately. {ACTION: {"type": "complaint", "department": "Front Desk", "priority": "Urgent", "description": "Noise complaint from neighboring room"}}"`;

/**
 * Generate AI response using OpenAI GPT-4o-mini
 * @param {Array} messages - Array of {role, content} objects
 * @param {Object} context - Additional context (reservation info, etc.)
 * @returns {Promise<Object>} - {response: string, action: Object|null}
 */
async function generateResponse(messages, context = {}) {
    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in .env');
    }

    // Build the conversation history
    const conversationMessages = [
        { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Add context if guest is verified
    if (context.verified && context.guestName && context.roomNumber) {
        conversationMessages.push({
            role: 'system',
            content: `GUEST CONTEXT: Verified guest ${context.guestName} in room ${context.roomNumber}. Check-out: ${context.checkOut || 'Unknown'}.`
        });
    }

    // Add conversation history
    messages.forEach(msg => {
        conversationMessages.push({
            role: msg.role === 'guest' ? 'user' : msg.role === 'ai' ? 'assistant' : 'system',
            content: msg.content
        });
    });

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: 'gpt-4o-mini',
                messages: conversationMessages,
                temperature: 0.7,
                max_tokens: 300
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const aiMessage = response.data.choices[0].message.content;

        // Parse action if present
        const action = extractAction(aiMessage);

        return {
            response: action ? aiMessage.replace(/\{ACTION:.*?\}/, '').trim() : aiMessage,
            action
        };
    } catch (error) {
        console.error('OpenAI API Error:', error.response?.data || error.message);
        
        // Fallback response
        if (error.response?.status === 401) {
            throw new Error('Invalid OpenAI API key');
        } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            throw new Error('OpenAI request timed out. Please try again.');
        }
        
        throw new Error('Unable to generate response. Please try again or request a staff member.');
    }
}

/**
 * Extract action directive from AI response
 * @param {String} message - AI response message
 * @returns {Object|null} - Extracted action or null
 */
function extractAction(message) {
    const actionMatch = message.match(/\{ACTION:\s*(\{.*?\})\}/);
    if (!actionMatch) return null;

    try {
        const action = JSON.parse(actionMatch[1]);
        // Validate action structure
        if (action.type && action.department && action.priority && action.description) {
            return action;
        }
    } catch (e) {
        console.error('Failed to parse action:', e);
    }
    
    return null;
}

/**
 * Determine intent from the first guest message
 * @param {String} message - Guest's message
 * @returns {String} - Intent category
 */
function classifyIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.match(/not working|broken|fix|repair|problem with/)) return 'maintenance';
    if (lowerMessage.match(/noise|loud|noisy|quiet|disturb/)) return 'noise_complaint';
    if (lowerMessage.match(/towel|clean|housekeep|tidy|sheet|linen/)) return 'housekeeping';
    if (lowerMessage.match(/room service|food|drink|menu|order/)) return 'food_beverage';
    if (lowerMessage.match(/extend|checkout|check out|stay longer|reservation/)) return 'reservation_change';
    if (lowerMessage.match(/recommend|restaurant|attraction|direction|uber|taxi/)) return 'concierge';
    
    return 'general';
}

module.exports = {
    generateResponse,
    classifyIntent
};
