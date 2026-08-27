# AI Concierge - Quick Configuration Examples

This is a quick reference for common configuration tasks. For complete documentation, see [AI_TRAINING_GUIDE.md](AI_TRAINING_GUIDE.md).

---

## Common Tasks

### 1. Update Check-in/Check-out Times

```bash
curl -X PUT http://localhost:3001/api/hotel-config/section/checkinCheckout \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "checkinTime": "3:00 PM",
    "checkoutTime": "11:00 AM",
    "earlyCheckinAvailable": true,
    "earlyCheckinFee": "$50"
  }'
```

**Result:** AI will now say: "Check-in is at 3:00 PM. Early check-in is available for $50."

---

### 2. Add a Restaurant

```bash
curl -X POST http://localhost:3001/api/hotel-config/knowledge/restaurants \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "The Steakhouse",
    "type": "onsite",
    "cuisine": "American Steakhouse",
    "hours": "5:00 PM - 10:00 PM daily",
    "phone": "(555) 123-4567",
    "priceRange": "$$$",
    "description": "Fine dining with locally sourced steaks",
    "reservationsRequired": true
  }'
```

**Result:** AI will recommend this restaurant when guests ask about dining.

---

### 3. Update Restaurant Hours (e.g., Sunday hours changed)

```bash
curl -X PUT http://localhost:3001/api/hotel-config/knowledge/restaurants/0 \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "hours": "5:00 PM - 11:00 PM Mon-Sat, Closed Sundays"
  }'
```

**Note:** `/0` means first restaurant, `/1` means second, etc.

---

### 4. Add FAQ (Most Important!)

```bash
curl -X POST http://localhost:3001/api/hotel-config/knowledge/faqs \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What time is breakfast served?",
    "answer": "Breakfast is served daily from 6:30 AM to 10:30 AM in our main dining room on the second floor.",
    "category": "dining"
  }'
```

**Result:** AI gives this exact answer every time someone asks about breakfast.

---

### 5. Disable Reservation Updates

```bash
curl -X PUT http://localhost:3001/api/hotel-config/section/aiBehavior \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "capabilities": {
      "updateReservations": false
    }
  }'
```

**Result:** When guests ask to extend stay, AI says "Let me transfer you to a staff member who can help with this."

---

### 6. Set Auto-Escalation Keywords

```bash
curl -X PUT http://localhost:3001/api/hotel-config/section/aiBehavior \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "autoEscalateKeywords": ["emergency", "urgent", "manager", "lawsuit", "police", "injury"]
  }'
```

**Result:** If guest says any of these words, AI immediately offers to transfer to a human.

---

### 7. Update WiFi Information

```bash
curl -X PUT http://localhost:3001/api/hotel-config/section/amenities \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "wifi": {
      "available": true,
      "password": "welcome2024",
      "instructions": "Connect to GrandPlaza-Guest network, password: welcome2024"
    }
  }'
```

**Result:** AI tells guests the exact wifi network and password.

---

### 8. Add a Policy

```bash
curl -X POST http://localhost:3001/api/hotel-config/knowledge/policies \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pet Policy",
    "description": "We welcome dogs up to 50 lbs. $50 per stay pet fee. Please register your pet at check-in.",
    "category": "pets"
  }'
```

**Result:** When guests ask about pets, AI gives this exact policy.

---

### 9. Change AI Tone

```bash
curl -X PUT http://localhost:3001/api/hotel-config/section/aiBehavior \
  -H "Authorization: Bearer YOUR_ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "responseStyle": {
      "tone": "formal",
      "maxResponseLength": 100
    }
  }'
```

**Tone Options:**
- `formal` → "Certainly, sir. I shall arrange that immediately."
- `professional_friendly` → "Absolutely! I'll get that taken care of right away."
- `casual` → "Sure thing! I'll handle that for you."
- `enthusiastic` → "Absolutely! I'd be happy to help with that!"

---

### 10. Get Training Suggestions

```bash
curl http://localhost:3001/api/hotel-config/training-suggestions \
  -H "Authorization: Bearer YOUR_ADMIN_JWT"
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

**What to do:** Add these as FAQs with your approved answers.

---

## Testing Your Changes

After any configuration change:

1. **Visit** http://localhost:3000/ai-concierge
2. **Ask** the question related to what you changed
3. **Verify** AI gives the correct answer

**Changes take effect immediately** - no server restart needed!

---

## JavaScript Examples (From Your Frontend)

### Update Configuration from Admin Page

```javascript
import sendRequest from './utilities/send-request';

// Update check-in time
async function updateCheckinTime(time) {
  const response = await sendRequest('/api/hotel-config/section/checkinCheckout', 'PUT', {
    checkinTime: time
  });
  console.log('Updated:', response);
}

// Add FAQ
async function addFAQ(question, answer, category) {
  const response = await sendRequest('/api/hotel-config/knowledge/faqs', 'POST', {
    question,
    answer,
    category
  });
  console.log('FAQ added:', response);
}

// Get training suggestions
async function getTrainingSuggestions() {
  const suggestions = await sendRequest('/api/hotel-config/training-suggestions');
  console.log('Suggestions:', suggestions);
}
```

---

## Common Scenarios

### Scenario 1: Restaurant Changes Closing Time

**Problem:** Restaurant now closes at 10 PM instead of 11 PM

**Solution:**
```bash
PUT /api/hotel-config/knowledge/restaurants/0
{ "hours": "5:00 PM - 10:00 PM daily" }
```

---

### Scenario 2: Pool Under Maintenance

**Problem:** Pool is closed for repairs this week

**Solution:**
```bash
PUT /api/hotel-config/section/amenities
{
  "pool": {
    "available": false
  }
}
```

**Or update FAQ:**
```bash
POST /api/hotel-config/knowledge/faqs
{
  "question": "Is the pool open?",
  "answer": "The pool is temporarily closed for maintenance through Friday. It will reopen on Saturday."
}
```

---

### Scenario 3: New Breakfast Hours

**Problem:** Breakfast hours changed to 7:00 AM - 11:00 AM

**Solution:**
```bash
# Option 1: Add/update FAQ (recommended)
POST /api/hotel-config/knowledge/faqs
{
  "question": "What time is breakfast?",
  "answer": "Breakfast is now served from 7:00 AM to 11:00 AM daily."
}

# Option 2: Update amenity info
PUT /api/hotel-config/section/amenities
{
  "restaurant": {
    "hours": "Breakfast: 7:00 AM - 11:00 AM daily"
  }
}
```

---

### Scenario 4: AI Is Too Chatty

**Problem:** AI responses are too long

**Solution:**
```bash
PUT /api/hotel-config/section/aiBehavior
{
  "responseStyle": {
    "maxResponseLength": 50
  }
}
```

---

### Scenario 5: Guests Keep Asking Same Question

**Problem:** 20 guests asked "Where is the ice machine?"

**Solution:**
```bash
POST /api/hotel-config/knowledge/faqs
{
  "question": "Where is the ice machine?",
  "answer": "Ice machines are located on each floor near the elevators.",
  "category": "amenities"
}
```

**Or check training suggestions:**
```bash
GET /api/hotel-config/training-suggestions
# Will show this question if asked frequently
```

---

## Reset Everything (Emergency)

**⚠️ Warning:** This deletes ALL your customizations!

```bash
curl -X POST http://localhost:3001/api/hotel-config/reset \
  -H "Authorization: Bearer YOUR_ADMIN_JWT"
```

---

## Get Current Configuration

```bash
curl http://localhost:3001/api/hotel-config \
  -H "Authorization: Bearer YOUR_ADMIN_JWT"
```

**Returns:** Full configuration JSON (useful for reviewing what you have)

---

## Best Practices

1. **Add FAQs First** - These give the AI approved exact answers
2. **Test After Changes** - Chat with AI to verify new info is correct
3. **Update Regularly** - When hours/policies change, update immediately
4. **Review Suggestions** - Check training suggestions monthly
5. **Start Conservative** - Disable capabilities you're unsure about, enable later

---

## Need Help?

- **Complete Guide:** [AI_TRAINING_GUIDE.md](AI_TRAINING_GUIDE.md)
- **Setup Guide:** [AI_CONCIERGE_README.md](AI_CONCIERGE_README.md)
- **API Reference:** See AI_TRAINING_GUIDE.md → API Reference section

---

**Remember:** All changes take effect immediately. No code changes or server restarts needed! 🎉
