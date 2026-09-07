# Guest Types & AI Concierge Handling Guide

The AI Concierge intelligently handles four distinct guest types, each with different needs, verification requirements, and available actions.

---

## 🎯 Guest Types Overview

### 1. 🏨 **In-House Guests** (Current Guests)
**Status:** Currently staying at the hotel  
**Primary Need:** Room service, maintenance, complaints, requests

**Capabilities:**
- ✅ Create maintenance tasks
- ✅ Create housekeeping tasks
- ✅ Log complaints
- ✅ Request amenities
- ✅ Get hotel information
- ✅ Local recommendations

**Verification:** **REQUIRED**
- Room Number
- Last Name
- Must match active "Checked In" reservation

**Example Interactions:**
```
Guest: "The AC in my room isn't working"
AI: "I'm sorry to hear that. To assist you, may I have your room number and last name?"
Guest: "Room 305, Smith"
AI: "Thank you, Mr./Ms. Smith! I've created a high-priority maintenance task..."
```

---

### 2. 📅 **Future Guests** (Pre-Arrival)
**Status:** Have reservation, not checked in yet  
**Primary Need:** Pre-arrival questions, reservation changes, special requests

**Capabilities:**
- ✅ Check reservation details
- ✅ Request room preferences
- ✅ Ask pre-arrival questions
- ✅ Get directions and check-in info
- ✅ Add special requests (create prep tasks for staff)
- ❌ Cannot request room service (not here yet)

**Verification:** **OPTIONAL**
- Confirmation Number OR
- Last Name + Arrival Date

**Example Interactions:**
```
Guest: "I have a reservation next week. Can I request a high floor?"
AI: "Of course! To help you, may I have your confirmation number or last name?"
Guest: "Johnson, arriving May 15th"
AI: "Found your reservation! I've noted your preference for a high floor..."
```

---

### 3. 🔍 **Prospective Guests** (Exploring)
**Status:** Interested in booking, no reservation yet  
**Primary Need:** Information, availability, rates, amenities

**Capabilities:**
- ✅ Provide hotel information
- ✅ Explain amenities and services
- ✅ Share rates and availability (general)
- ✅ Give location and directions
- ✅ Answer pre-booking questions
- ✅ Connect to reservations team
- ❌ Cannot create tasks or complaints
- ❌ Cannot access reservation system

**Verification:** **NOT REQUIRED**

**Example Interactions:**
```
Guest: "Do you have rooms available this weekend?"
AI: "Yes! We have availability. Check-in is at 3 PM. Our rooms feature..."
AI: "Would you like me to connect you with our reservations team?"
```

---

### 4. ✅ **Past Guests** (Checked Out)
**Status:** Already checked out  
**Primary Need:** Billing, feedback, reviews, lost items

**Capabilities:**
- ✅ Answer billing questions
- ✅ Provide receipts/invoices
- ✅ Handle feedback and reviews
- ✅ Lost and found inquiries
- ✅ Log post-stay complaints/compliments
- ❌ Cannot create room service tasks
- ❌ Cannot request maintenance

**Verification:** **OPTIONAL**
- Checkout Date OR
- Last Name + Dates of Stay

**Example Interactions:**
```
Guest: "I checked out yesterday. Can I get a copy of my receipt?"
AI: "Of course! To locate your reservation, may I have your last name and checkout date?"
Guest: "Davis, checked out May 10th"
AI: "Found your stay! I'll email your receipt to the address on file..."
```

---

## 🔐 Verification Matrix

| Guest Type | Verification Required | Info Needed | Purpose |
|------------|----------------------|-------------|---------|
| In-House | ✅ **YES** (Strict) | Room# + Last Name | Security, create tasks |
| Future | ⚪ Optional | Confirm# or Last Name | Access reservation |
| Prospective | ❌ NO | None | Info only, no system access |
| Past | ⚪ Optional | Last Name + Dates | Billing/feedback |

---

## 🎯 AI Decision Flow

```
1. Guest arrives → AI greets
2. AI asks: "Are you currently staying, have an upcoming reservation, or exploring?"
   OR detects from first message
3. Based on guest type:
   ├─ In-House → Request verification → Full service
   ├─ Future → Optional verify → Reservation help
   ├─ Prospective → No verify → Info only
   └─ Past → Optional verify → Billing/feedback
```

---

## 🛠️ Action Permissions by Guest Type

| Action | In-House | Future | Prospective | Past |
|--------|----------|--------|-------------|------|
| Create Maintenance Task | ✅ | ❌ | ❌ | ❌ |
| Create Housekeeping Task | ✅ | ❌ | ❌ | ❌ |
| Log Complaint | ✅ | ❌ | ❌ | ✅ (post-stay) |
| Request Room Service | ✅ | ❌ | ❌ | ❌ |
| Get Hotel Info | ✅ | ✅ | ✅ | ✅ |
| Local Recommendations | ✅ | ✅ | ✅ | ✅ |
| Check Reservation | ✅ | ✅ | ❌ | ✅ |
| Modify Reservation | ✅ | ✅ | ❌ | ❌ |
| Billing Inquiries | ✅ | ❌ | ❌ | ✅ |
| Add Special Requests | ❌ | ✅ | ❌ | ❌ |

---

## 💡 Smart Detection Examples

The AI automatically detects guest type from context:

**In-House Indicators:**
- "My room", "Room 305", "AC not working", "Need towels"
- "I'm staying in room...", "Currently at the hotel"

**Future Guest Indicators:**
- "I have a reservation", "Arriving next week"
- "Confirmation number", "I'm checking in tomorrow"

**Prospective Indicators:**
- "Do you have rooms?", "What are your rates?"
- "Interested in booking", "Looking for a hotel"

**Past Guest Indicators:**
- "I checked out", "I stayed last week"
- "Need a receipt", "Want to leave feedback"

---

## 🚀 Implementation Notes

### Frontend (Welcome Screen)
- 4 Guest Type Cards
- Clear icons and descriptions
- One-click starts conversation with context

### Backend (AI Service)
- Updated system prompt with guest type rules
- Context-aware verification
- Permission checks before actions

### Database
- Store guest type in conversation metadata
- Track verification status
- Log actions based on permissions

---

## 📊 Analytics & Reporting

Track by Guest Type:
- **In-House:** Most common, highest task creation
- **Future:** Pre-arrival requests, special needs
- **Prospective:** Info requests, conversion potential
- **Past:** Feedback, billing inquiries

---

## 🔮 Future Enhancements

1. **Auto-Detection:** AI detects guest type from reservation system
2. **Multi-Language:** Support for international guests
3. **Loyalty Integration:** Recognize returning guests
4. **Smart Upsells:** Offer upgrades to prospective/future guests
5. **Feedback Loop:** Past guest reviews → training data

---

## 📞 Escalation Rules

**When to Transfer to Human:**
- Billing disputes (past guests)
- Complex reservation changes (future guests)
- Serious complaints (any guest type)
- Requests outside AI capabilities
- Guest explicitly requests human agent

---

## ✅ Best Practices

1. **Always identify guest type early**
2. **Verify in-house guests before ANY action**
3. **Be helpful to prospective guests** (potential bookings!)
4. **Handle past guest complaints seriously** (reputation!)
5. **Set appropriate expectations** based on guest type
6. **Offer human escalation** when appropriate

---

**This system ensures the right level of service for each guest type while maintaining security and efficiency!** 🎉
