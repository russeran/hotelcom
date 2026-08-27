# AI Concierge Training & Configuration Guide

## Overview

This guide explains how to **train**, **limit**, and **update** the AI concierge to match your hotel's specific needs without touching any code.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [How the AI Works](#how-the-ai-works)
3. [Training the AI](#training-the-ai)
4. [Limiting AI Capabilities](#limiting-ai-capabilities)
5. [Updating Hotel Information](#updating-hotel-information)
6. [Managing Knowledge Base](#managing-knowledge-base)
7. [Advanced Configuration](#advanced-configuration)
8. [API Reference](#api-reference)

---

## Quick Start

### Accessing Configuration (Admin Dashboard)

**Location:** `/admin` page → Scroll to "AI Configuration" section (coming soon: dedicated UI panel)

**Or via API:**
```bash
# Get current configuration
GET /api/hotel-config

# Update configuration
PUT /api/hotel-config
```

---

## How the AI Works

The AI concierge uses **GPT-4o-mini** with a **dynamic system prompt** built from your configuration:

```
User asks question
    ↓
AI reads your hotel config (from database)
    ↓
Builds custom system prompt with your info
    ↓
Generates response using GPT-4o-mini
    ↓
Checks if action is allowed (based on your limits)
    ↓
Returns response + action (if allowed)
```

**Key Point:** The AI's behavior is entirely controlled by the `HotelConfig` document in your database. Change the config, and the AI changes immediately (no code changes needed).

---

## Training the AI

### Method 1: Update Hotel Information

The AI learns from the information you provide in the configuration:

**Check-in/Check-out Times:**
```javascript
PUT /api/hotel-config/section/checkinCheckout
{
  "checkinTime": "3:00 PM",
  "checkoutTime": "11:00 AM",
  "earlyCheckinAvailable": true,
  "earlyCheckinFee": "$50"
}
```

**Example Conversation After Update:**
```
Guest: "What time is check-in?"
AI: "Check-in is at 3:00 PM. If you need early check-in, it's available for $50."
```

### Method 2: Add FAQs (Most Important!)

**Why FAQs Matter:**
- AI gives **consistent, approved answers**
- You control **exact wording**
- Prevents AI from **making up information**

**How to Add:**
```javascript
POST /api/hotel-config/knowledge/faqs
{
  "question": "What time is breakfast served?",
  "answer": "Breakfast is served daily from 6:30 AM to 10:30 AM in our main dining room on the second floor.",
  "category": "dining"
}
```

**Example:**
```
Guest: "When is breakfast?"
AI: "Breakfast is served daily from 6:30 AM to 10:30 AM in our main dining room on the second floor."
```

### Method 3: Add Restaurants

```javascript
POST /api/hotel-config/knowledge/restaurants
{
  "name": "The Steakhouse",
  "type": "onsite",
  "cuisine": "American Steakhouse",
  "hours": "5:00 PM - 10:00 PM daily",
  "phone": "(555) 123-4567",
  "priceRange": "$$$",
  "description": "Fine dining featuring locally sourced steaks and seafood",
  "reservationsRequired": true
}
```

**Example:**
```
Guest: "Where can I get dinner?"
AI: "We have The Steakhouse, an American steakhouse open 5 PM to 10 PM daily. Reservations are recommended. Call (555) 123-4567."
```

### Method 4: Add Policies

```javascript
POST /api/hotel-config/knowledge/policies
{
  "title": "Pet Policy",
  "description": "We welcome dogs up to 50 lbs. $50 per stay pet fee. Please register at check-in.",
  "category": "pets"
}
```

**Example:**
```
Guest: "Can I bring my dog?"
AI: "Yes! We welcome dogs up to 50 lbs. There's a $50 per stay pet fee. Please register at check-in."
```

### Method 5: Learn from Past Conversations

**Get Training Suggestions:**
```javascript
GET /api/hotel-config/training-suggestions
```

**Returns:**
```json
{
  "suggestions": [
    {
      "question": "Is there a microwave in the room?",
      "frequency": 12,
      "suggestedAnswer": "Add answer here..."
    },
    {
      "question": "Where is the ice machine?",
      "frequency": 8,
      "suggestedAnswer": "Add answer here..."
    }
  ]
}
```

**What This Means:**
- These questions were asked **frequently** by guests
- You should add them as FAQs with your approved answers
- The AI will then give consistent responses

---

## Limiting AI Capabilities

### Enable/Disable AI Entirely

```javascript
PUT /api/hotel-config/section/aiBehavior
{
  "enabled": false
}
```

**Result:** AI will respond: "I apologize, but the AI concierge service is temporarily unavailable. Please contact the front desk."

### Control What AI Can Do

```javascript
PUT /api/hotel-config/section/aiBehavior
{
  "capabilities": {
    "createTasks": true,          // Can create maintenance/housekeeping tasks
    "createComplaints": true,      // Can log complaints
    "updateReservations": false,   // CANNOT modify reservations
    "provideRoomService": true,    // Can create room service tasks
    "bookAmenities": false         // CANNOT book spa/gym/etc
  }
}
```

**Example:**
```
Guest: "Can you extend my stay by one night?"
AI: "I've noted your request. Let me transfer you to a staff member who can help with this."
[Because updateReservations: false]
```

### Set Conversation Length Limit

```javascript
PUT /api/hotel-config/section/aiBehavior
{
  "maxConversationLength": 20  // Max 20 messages
}
```

**Why:** Prevents AI from going in circles. After 20 messages, it offers to transfer to a human.

### Auto-Escalate Keywords

```javascript
PUT /api/hotel-config/section/aiBehavior
{
  "autoEscalateKeywords": ["emergency", "urgent", "manager", "lawsuit", "police"]
}
```

**Example:**
```
Guest: "This is an emergency!"
AI: "I understand this is urgent. Let me transfer you to a staff member who can assist you immediately."
[Automatic transfer triggered]
```

### Set Default Priorities

```javascript
PUT /api/hotel-config/section/aiBehavior
{
  "priorityRules": {
    "maintenanceDefault": "High",     // All maintenance requests = High
    "housekeepingDefault": "Normal",  // Housekeeping = Normal
    "complaintDefault": "Urgent"      // All complaints = Urgent
  }
}
```

**Result:** AI uses these defaults when creating tasks/complaints.

### Require Guest Verification

```javascript
PUT /api/hotel-config/section/aiBehavior
{
  "requireVerification": true
}
```

**Why:** AI won't create tasks/complaints until guest proves they're staying at the hotel (room number + last name).

---

## Updating Hotel Information

### Basic Hotel Info

```javascript
PUT /api/hotel-config/section/hotelInfo
{
  "name": "Grand Plaza Hotel",
  "address": "123 Main Street, New York, NY 10001",
  "phone": "(555) 123-4567",
  "email": "info@grandplaza.com",
  "timezone": "America/New_York"
}
```

### Amenities

**Enable/Update Amenities:**
```javascript
PUT /api/hotel-config/section/amenities
{
  "pool": {
    "available": true,
    "hours": "6:00 AM - 10:00 PM daily",
    "location": "Rooftop, 15th floor"
  },
  "gym": {
    "available": true,
    "hours": "24/7",
    "location": "Lower level"
  },
  "wifi": {
    "available": true,
    "instructions": "Network: GrandPlaza-Guest, Password: welcome2024"
  },
  "roomService": {
    "available": true,
    "hours": "6:00 AM - 11:00 PM",
    "phone": "ext. 777"
  }
}
```

**Example Conversation:**
```
Guest: "Is there a pool?"
AI: "Yes! Our rooftop pool on the 15th floor is open 6 AM to 10 PM daily."

Guest: "What's the wifi password?"
AI: "Connect to GrandPlaza-Guest. Password: welcome2024"
```

### Transportation

```javascript
PUT /api/hotel-config/section/knowledgeBase
{
  "transportation": {
    "airportShuttle": {
      "available": true,
      "schedule": "Every 30 minutes, 5 AM - 11 PM",
      "cost": "Complimentary for guests"
    },
    "rideshare": {
      "description": "Uber and Lyft available",
      "pickupLocation": "Main entrance on 5th Avenue"
    },
    "taxi": {
      "description": "Taxis available 24/7 at main entrance",
      "estimatedCost": "~$60 to JFK Airport"
    }
  }
}
```

---

## Managing Knowledge Base

### Restaurants (Onsite & Nearby)

**Add:**
```bash
POST /api/hotel-config/knowledge/restaurants
```

**Update:**
```bash
PUT /api/hotel-config/knowledge/restaurants/0
# (0 = first restaurant, 1 = second, etc.)
```

**Delete:**
```bash
DELETE /api/hotel-config/knowledge/restaurants/0
```

**Example: Update Restaurant Hours**
```javascript
PUT /api/hotel-config/knowledge/restaurants/0
{
  "hours": "5:00 PM - 11:00 PM Mon-Sat, Closed Sundays"
}
```

### Local Attractions

```javascript
POST /api/hotel-config/knowledge/attractions
{
  "name": "Central Park",
  "type": "park",
  "description": "843-acre public park with walking paths, lakes, and attractions",
  "distance": "0.3 miles (5 minute walk)",
  "hours": "6:00 AM - 1:00 AM daily",
  "cost": "Free"
}
```

### FAQs

**Categories:** `checkin`, `amenities`, `dining`, `local`, `policies`

```javascript
POST /api/hotel-config/knowledge/faqs
{
  "question": "Is parking available?",
  "answer": "Yes, valet parking is $45/day. Self-parking is $35/day in our underground garage.",
  "category": "amenities"
}
```

**Update Existing FAQ:**
```javascript
PUT /api/hotel-config/knowledge/faqs/0
{
  "answer": "Yes, valet parking is now $50/day (updated rate). Self-parking is $35/day."
}
```

### Policies

```javascript
POST /api/hotel-config/knowledge/policies
{
  "title": "Cancellation Policy",
  "description": "Free cancellation up to 24 hours before arrival. Cancellations within 24 hours are subject to a one-night charge.",
  "category": "cancellation"
}
```

---

## Advanced Configuration

### Custom System Prompt (Override Everything)

**For advanced users** who want complete control:

```javascript
PUT /api/hotel-config/section/aiBehavior
{
  "customSystemPrompt": "You are a luxury hotel concierge assistant. Always address guests as 'sir' or 'madam'. Never use contractions. Always suggest our premium services. [Your full custom prompt...]"
}
```

**Warning:** This overrides ALL automatic prompt building. Use only if you know what you're doing.

### Response Style

```javascript
PUT /api/hotel-config/section/aiBehavior
{
  "responseStyle": {
    "tone": "formal",                    // formal | professional_friendly | casual | enthusiastic
    "maxResponseLength": 100             // Max words per response
  }
}
```

**Tone Examples:**
- **formal**: "Certainly, sir. I shall arrange that immediately."
- **professional_friendly**: "Absolutely! I'll get that taken care of right away."
- **casual**: "Sure thing! I'll handle that for you."
- **enthusiastic**: "Absolutely! I'd be happy to help with that! 😊"

### Escalation Rules

```javascript
PUT /api/hotel-config/section/escalation
{
  "autoTransferKeywords": ["manager", "supervisor", "speak to someone"],
  "autoTransferAfterMessages": 15,
  "autoTransferOnNegativeSentiment": true,
  "transferDepartments": [
    {
      "keyword": "billing",
      "department": "Front Desk",
      "phone": "ext. 100"
    },
    {
      "keyword": "reservation problem",
      "department": "Reservations",
      "phone": "ext. 200"
    }
  ]
}
```

---

## API Reference

### Get Configuration

```bash
GET /api/hotel-config
```

**Returns:** Full configuration object

### Update Entire Configuration

```bash
PUT /api/hotel-config
{
  "hotelInfo": { ... },
  "checkinCheckout": { ... },
  "amenities": { ... },
  ...
}
```

### Update Specific Section

```bash
PUT /api/hotel-config/section/:section
```

**Sections:**
- `hotelInfo`
- `checkinCheckout`
- `amenities`
- `aiBehavior`
- `knowledgeBase`
- `escalation`
- `analytics`

### Knowledge Base Operations

**Add Item:**
```bash
POST /api/hotel-config/knowledge/:type
```

**Update Item:**
```bash
PUT /api/hotel-config/knowledge/:type/:index
```

**Delete Item:**
```bash
DELETE /api/hotel-config/knowledge/:type/:index
```

**Types:**
- `restaurants`
- `attractions`
- `faqs`
- `policies`

### Get Training Suggestions

```bash
GET /api/hotel-config/training-suggestions
```

Returns frequently asked questions that should be added as FAQs.

### Reset to Defaults (Admin Only)

```bash
POST /api/hotel-config/reset
```

**Warning:** This deletes all customizations!

---

## Best Practices

### 1. Start with FAQs
Add the top 10-20 questions your guests ask most often. This gives the AI approved answers immediately.

### 2. Update Regularly
When hours change, menus change, policies change → update the config immediately.

### 3. Monitor Conversations
Review AI conversations weekly to find:
- Questions the AI answered incorrectly → Add as FAQs
- Questions the AI couldn't answer → Add to knowledge base
- Actions the AI took that you don't want → Disable that capability

### 4. Test After Changes
After updating configuration, test a few conversations to ensure the AI responds correctly.

### 5. Use Training Suggestions
Check `/api/hotel-config/training-suggestions` monthly to see what guests are asking about.

---

## Example: Complete Setup

**Step 1: Set Basic Info**
```javascript
PUT /api/hotel-config/section/hotelInfo
{
  "name": "Sunset Beach Resort",
  "phone": "(555) 987-6543"
}
```

**Step 2: Set Check-in/Check-out**
```javascript
PUT /api/hotel-config/section/checkinCheckout
{
  "checkinTime": "4:00 PM",
  "checkoutTime": "11:00 AM"
}
```

**Step 3: Add Top 5 FAQs**
```javascript
POST /api/hotel-config/knowledge/faqs
{ "question": "What time is breakfast?", "answer": "6:30 AM - 10:30 AM daily", "category": "dining" }

POST /api/hotel-config/knowledge/faqs
{ "question": "Is wifi free?", "answer": "Yes, complimentary wifi throughout the resort.", "category": "amenities" }

// ... etc
```

**Step 4: Add Amenity Hours**
```javascript
PUT /api/hotel-config/section/amenities
{
  "pool": { "available": true, "hours": "6 AM - 10 PM" },
  "gym": { "available": true, "hours": "24/7" }
}
```

**Step 5: Test!**
Visit `/ai-concierge` and ask:
- "What time is breakfast?" → Should get exact answer
- "Is there wifi?" → Should confirm it's free
- "What time can I check in?" → Should say 4:00 PM

---

## Troubleshooting

### AI Gives Wrong Information
**Solution:** Add correct information as FAQ with exact approved answer.

### AI Does Actions You Don't Want
**Solution:** Disable that capability in `aiBehavior.capabilities`.

### AI Talks Too Much
**Solution:** Reduce `aiBehavior.responseStyle.maxResponseLength` to 50-75 words.

### AI Too Formal/Informal
**Solution:** Change `aiBehavior.responseStyle.tone`.

### AI Won't Transfer to Human
**Solution:** Lower `escalation.autoTransferAfterMessages` or add more `autoTransferKeywords`.

---

## Summary

**The AI learns from three sources:**
1. **Hotel Configuration** (check-in times, amenities, etc.)
2. **Knowledge Base** (FAQs, restaurants, attractions, policies)
3. **AI Behavior Rules** (what it can/can't do)

**To train the AI:**
- Add FAQs for common questions
- Update hotel info when it changes
- Review conversations and add missing information

**To limit the AI:**
- Disable capabilities you don't want
- Add auto-escalation keywords
- Set conversation length limits

**All changes take effect immediately** - no code changes or server restarts needed!

---

## Need Help?

See the main README for setup instructions, or review conversation transcripts in the Admin dashboard to see how the AI is performing.
