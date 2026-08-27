const axios = require('axios');
const HotelConfig = require('../models/hotelConfig');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Build dynamic system prompt based on hotel configuration
 */
async function buildSystemPrompt() {
    const config = await HotelConfig.getConfig();

    // Use custom prompt if provided, otherwise build default
    if (config.aiBehavior.customSystemPrompt) {
        return config.aiBehavior.customSystemPrompt;
    }

    const { hotelInfo, checkinCheckout, amenities, knowledgeBase, aiBehavior } = config;

    let prompt = `You are a helpful AI concierge assistant for ${hotelInfo.name}. Your role is to help hotel guests with their requests and route issues to the appropriate departments.

HOTEL INFORMATION:
- Hotel: ${hotelInfo.name}
- Check-in time: ${checkinCheckout.checkinTime}
- Check-out time: ${checkinCheckout.checkoutTime}
${checkinCheckout.earlyCheckinAvailable ? `- Early check-in available (${checkinCheckout.earlyCheckinFee})` : ''}
${checkinCheckout.lateCheckoutAvailable ? `- Late check-out available (${checkinCheckout.lateCheckoutFee})` : ''}

AMENITIES:`;

    // Add amenity information
    if (amenities.wifi?.available) prompt += `\n- WiFi: ${amenities.wifi.instructions || 'Available'}`;
    if (amenities.parking?.available) prompt += `\n- Parking: ${amenities.parking.cost} at ${amenities.parking.location}`;
    if (amenities.pool?.available) prompt += `\n- Pool: Open ${amenities.pool.hours}`;
    if (amenities.gym?.available) prompt += `\n- Gym: Open ${amenities.gym.hours}`;
    if (amenities.restaurant?.available) prompt += `\n- Restaurant: Open ${amenities.restaurant.hours}`;
    if (amenities.roomService?.available) prompt += `\n- Room Service: Available ${amenities.roomService.hours}, call ${amenities.roomService.phone}`;

    // Add restaurants
    if (knowledgeBase.restaurants && knowledgeBase.restaurants.length > 0) {
        prompt += `\n\nRESTAURANTS:`;
        knowledgeBase.restaurants.forEach(r => {
            prompt += `\n- ${r.name} (${r.type}): ${r.cuisine || ''} ${r.hours ? `Open ${r.hours}` : ''} ${r.priceRange || ''}`;
            if (r.description) prompt += ` - ${r.description}`;
        });
    }

    // Add transportation info
    if (knowledgeBase.transportation) {
        const t = knowledgeBase.transportation;
        prompt += `\n\nTRANSPORTATION:`;
        if (t.airportShuttle?.available) prompt += `\n- Airport Shuttle: ${t.airportShuttle.schedule}, ${t.airportShuttle.cost}`;
        if (t.taxi?.description) prompt += `\n- Taxi: ${t.taxi.description}`;
        if (t.rideshare?.description) prompt += `\n- Rideshare: ${t.rideshare.description}`;
    }

    // Add FAQs
    if (knowledgeBase.faqs && knowledgeBase.faqs.length > 0) {
        prompt += `\n\nCOMMON QUESTIONS:`;
        knowledgeBase.faqs.forEach(faq => {
            prompt += `\n- Q: ${faq.question}\n  A: ${faq.answer}`;
        });
    }

    // Add policies
    if (knowledgeBase.policies && knowledgeBase.policies.length > 0) {
        prompt += `\n\nHOTEL POLICIES:`;
        knowledgeBase.policies.forEach(p => {
            prompt += `\n- ${p.title}: ${p.description}`;
        });
    }

    prompt += `\n\nIMPORTANT RULES:
1. Always be ${config.aiBehavior.responseStyle.tone.replace('_', ' ')} and empathetic
2. Keep responses concise (max ${config.aiBehavior.responseStyle.maxResponseLength} words)
3. When guests report issues, acknowledge the problem and assure them it will be handled
4. For maintenance issues (AC, plumbing, electrical, etc.) → route to "Maintenance" department
5. For housekeeping requests (towels, cleaning, amenities) → route to "Housekeeping" department
6. For noise complaints or guest conflicts → route to "Front Desk" department with HIGH priority
7. For food/beverage requests → route to "F&B" (Food & Beverage) department
8. For concierge services (recommendations, bookings, directions) → provide helpful information
9. For reservation changes → handle if possible or escalate
10. If you cannot help, offer to transfer to a staff member

PRIORITY LEVELS (use configured defaults):
- Maintenance: ${aiBehavior.priorityRules.maintenanceDefault}
- Housekeeping: ${aiBehavior.priorityRules.housekeepingDefault}
- Complaints: ${aiBehavior.priorityRules.complaintDefault}
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

    return prompt;
}
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

    // Check if AI is enabled
    const config = await HotelConfig.getConfig();
    if (!config.aiBehavior.enabled) {
        return {
            response: 'I apologize, but the AI concierge service is temporarily unavailable. Please contact the front desk for assistance.',
            action: null
        };
    }

    // Check conversation length limit
    if (messages.length >= config.aiBehavior.maxConversationLength) {
        return {
            response: 'We\'ve had a long conversation! To ensure quality service, I\'d like to transfer you to a staff member who can continue assisting you.',
            action: { type: 'transfer', reason: 'max_length_reached' }
        };
    }

    // Build dynamic system prompt with hotel-specific information
    const systemPrompt = await buildSystemPrompt();

    // Build the conversation history
    const conversationMessages = [
        { role: 'system', content: systemPrompt }
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

        // Check for auto-escalation keywords
        const lowerMessage = aiMessage.toLowerCase();
        if (config.aiBehavior.autoEscalateKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
            return {
                response: aiMessage + '\n\nLet me transfer you to a staff member who can assist you immediately.',
                action: { type: 'transfer', reason: 'keyword_match' }
            };
        }

        // Parse action if present
        const action = extractAction(aiMessage);

        // Check if AI has permission to perform this action
        if (action && !canPerformAction(action.type, config)) {
            return {
                response: 'I\'ve noted your request. Let me transfer you to a staff member who can help with this.',
                action: { type: 'transfer', reason: 'insufficient_capability' }
            };
        }

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
 * Check if AI is allowed to perform a specific action type
 */
function canPerformAction(actionType, config) {
    const capabilities = config.aiBehavior.capabilities;
    
    switch(actionType) {
        case 'task':
            return capabilities.createTasks;
        case 'complaint':
            return capabilities.createComplaints;
        case 'reservation_update':
            return capabilities.updateReservations;
        case 'info':
            return true; // Always allowed to provide information
        default:
            return false;
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
