# AI Concierge - Text-Based Prototype

## Overview

The AI Concierge is a text-based chat interface that allows hotel guests to interact with an AI assistant powered by GPT-4o-mini. This prototype demonstrates the core functionality before investing in voice integration.

## Features

### Guest-Facing Features
- **24/7 Text Chat Interface** - Guests can chat with the AI at `/ai-concierge`
- **Guest Verification** - Secure verification via room number + last name
- **Smart Intent Recognition** - AI automatically classifies requests (maintenance, housekeeping, complaints, etc.)
- **Automatic Action Routing** - Creates tasks and complaints in the correct departments
- **Multi-Turn Conversations** - Maintains context throughout the conversation
- **Satisfaction Rating** - Guests can rate their experience (1-5 stars)

### Staff-Facing Features (Admin Dashboard)
- **Conversation Analytics** - Total conversations, verification rate, actions taken
- **Intent Breakdown** - See what guests are asking about most
- **Conversation History** - View all past conversations with full transcripts
- **Action Tracking** - See tasks and complaints created by the AI
- **Performance Metrics** - Average satisfaction ratings, response patterns

## How It Works

### For Guests

1. **Start Conversation**
   - Visit `/ai-concierge` (no login required)
   - AI greets the guest

2. **Verification (Optional but Recommended)**
   - Guest provides room number and last name
   - System verifies against active reservations
   - Once verified, AI has access to reservation details

3. **Make Requests**
   - Guest types their request (e.g., "The AC isn't working")
   - AI understands the intent and responds appropriately
   - AI automatically creates tasks/complaints in HotelCom

4. **End Conversation**
   - Guest can end the conversation and rate their experience

### For Staff

**View Conversations:**
- Managers and admins can view all AI conversations in the Admin page
- See which requests were handled successfully
- Review conversation transcripts for quality assurance
- Monitor AI performance metrics

**Actions Taken:**
- All tasks and complaints created by the AI appear in the respective pages
- Staff can see they were created by "AI Concierge Guest"
- Normal workflow continues from there

## Setup Instructions

### 1. Get OpenAI API Key

1. Sign up at https://platform.openai.com/
2. Go to https://platform.openai.com/api-keys
3. Create a new API key
4. Copy the key (starts with `sk-...`)

### 2. Configure Environment

Add to your `.env` file:

```env
OPENAI_API_KEY=sk-your-key-here
```

### 3. Start the Services

Make sure MongoDB is running, then:

```bash
# Terminal 1: Start the backend
node server.js

# Terminal 2: Start the frontend
BROWSER=none PORT=3000 npm start
```

### 4. Test It Out

1. Create a test reservation:
   - Go to http://localhost:3000
   - Login as admin
   - Go to Reservations page
   - Create a reservation (e.g., Room 101, John Smith, status: Checked In)

2. Test the AI Concierge:
   - Open a new incognito window (or logout)
   - Go to http://localhost:3000/ai-concierge
   - Chat with the AI
   - Try verifying with the test reservation details
   - Make a maintenance request or complaint

3. View Results:
   - Login as admin
   - Check the Tasks or Complaints pages - you'll see the AI-created items
   - Check the Admin page - scroll to "AI Concierge Analytics" section

## What the AI Can Do

### Request Types

**Maintenance Issues** → Creates task for Maintenance department
- Examples: "AC not working", "Broken TV", "Leaky faucet"

**Housekeeping Requests** → Creates task for Housekeeping department
- Examples: "Need extra towels", "Room needs cleaning"

**Noise Complaints** → Creates urgent complaint for Front Desk
- Examples: "Loud neighbors", "Noise disturbance"

**Food & Beverage** → Creates task for F&B department
- Examples: "Room service request", "Restaurant recommendation"

**Concierge Services** → Provides information
- Examples: "Where's a good restaurant?", "How do I get to the airport?"

**Reservation Changes** → Handles check-out date, room changes
- Examples: "I want to extend my stay", "When do I check out?"

### Priority Levels

The AI automatically assigns priority:
- **Urgent**: Safety issues, major complaints
- **High**: Broken equipment, service failures
- **Normal**: Standard requests
- **Low**: Minor issues, information requests

## Cost Estimate

### Per Conversation
- **GPT-4o-mini**: ~$0.01 per conversation
- Average conversation: 4-6 messages
- Total cost: ~$0.01 per guest interaction

### Monthly Costs (Example)
- 100 conversations/month: ~$1
- 500 conversations/month: ~$5
- 1,000 conversations/month: ~$10

**Very affordable for testing!**

## Testing Scenarios

Try these test conversations:

### 1. Maintenance Request
```
Guest: "Hi, the air conditioning in my room isn't working"
[AI will verify room, then create a High priority Maintenance task]
```

### 2. Noise Complaint
```
Guest: "I'm trying to sleep but the room above me is being very loud"
[AI will create an Urgent complaint for Front Desk]
```

### 3. Housekeeping Request
```
Guest: "Can I get some extra towels delivered to my room?"
[AI will create a Normal priority Housekeeping task]
```

### 4. Reservation Query
```
Guest: "What time do I need to check out?"
[AI will look up the reservation and respond]
```

### 5. Concierge Question
```
Guest: "Can you recommend a good restaurant nearby?"
[AI will provide helpful information]
```

## Admin Dashboard

**Location:** `/admin` (requires admin role)

**AI Concierge Section Shows:**
- Total conversations
- Verified vs. unverified guests
- Tasks created by AI
- Complaints logged by AI
- Average satisfaction rating
- Top request types (intents)
- Full conversation history with transcripts

## Next Steps (Future Enhancements)

Once you've validated the text prototype:

1. **Add Voice** (~2-3 days)
   - Integrate Twilio for phone calls
   - Add speech-to-text (Deepgram or OpenAI Whisper)
   - Add text-to-speech (ElevenLabs or Azure)
   - Cost: ~$0.10-0.25 per call

2. **PMS Integration**
   - Connect to Opera, Mews, Cloudbeds, etc.
   - Real-time room status updates
   - Billing integration

3. **Advanced Features**
   - Multi-language support
   - Proactive follow-up ("How was your room service?")
   - Smart escalation rules
   - Analytics dashboard improvements

## Troubleshooting

### "Invalid OpenAI API key" Error
- Check that `OPENAI_API_KEY` is set in `.env`
- Make sure the key starts with `sk-`
- Verify the key is active at https://platform.openai.com/api-keys

### "Conversation not found" Error
- Clear browser cookies/localStorage
- Refresh the page to start a new session

### Verification Fails
- Make sure the reservation exists in the database
- Status must be "Checked In"
- Room number and last name must match exactly
- Last name matching is case-insensitive

### AI Not Creating Tasks/Complaints
- Check the conversation transcript in Admin dashboard
- Verify the AI recognized the intent (look for action badges)
- Make sure the guest is verified before making requests

## Security Notes

- Guest conversations are stored in the database (for quality assurance)
- No credit card or sensitive PII is collected
- OpenAI API key is server-side only (never exposed to clients)
- Guest verification required before taking actions
- All actions are logged in the audit trail

## Architecture

```
Guest Browser
    ↓
/ai-concierge (React page)
    ↓
/api/ai-concierge/* (Express routes)
    ↓
OpenAI GPT-4o-mini (Cloud API)
    ↓
HotelCom Database (MongoDB)
    ↓
Tasks, Complaints, Reservations (Existing features)
```

## Files Added

**Backend:**
- `models/aiConversation.js` - Conversation data model
- `config/aiService.js` - OpenAI integration
- `controllers/api/aiConcierge.js` - Business logic
- `routes/api/aiConcierge.js` - API routes

**Frontend:**
- `src/pages/AiConciergePage/` - Guest chat interface
- `src/components/AiConversationsPanel/` - Admin analytics
- `src/utilities/aiConcierge-api.js` - API helpers

## Questions?

This is a prototype to prove the concept works. Test it thoroughly with your team and gather feedback before investing in voice integration!

**Cost so far:** ~$0-10 for testing (extremely low risk!)

**Next milestone:** Once you're confident it handles requests correctly, we can add voice capabilities for ~$2-6K total investment.
