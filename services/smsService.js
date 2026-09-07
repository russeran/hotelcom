/**
 * SMS Service (Twilio Integration-Ready)
 * Currently logs SMS to console. Replace with Twilio when ready.
 */

const RestaurantReservation = require('../models/restaurantReservation');
const Restaurant = require('../models/restaurant');
const Waitlist = require('../models/waitlist');

/**
 * Send confirmation SMS
 * @param {ObjectId} reservationId
 * @returns {Promise<Object>} { sent, provider, messageId }
 */
async function sendConfirmationSMS(reservationId) {
    try {
        const reservation = await RestaurantReservation.findById(reservationId).populate('restaurantId');
        if (!reservation || !reservation.guestPhone) {
            return { sent: false, reason: 'No phone number' };
        }

        const restaurant = reservation.restaurantId;
        
        const message = `${restaurant.name} Reservation Confirmed!
Date: ${new Date(reservation.date).toLocaleDateString()}
Time: ${reservation.time}
Party: ${reservation.partySize}
Confirmation: ${reservation.confirmationNumber}
${restaurant.phone ? `\nCall ${restaurant.phone} for changes` : ''}`;

        // **INTEGRATION POINT**: Replace with actual Twilio
        // const twilio = require('twilio');
        // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        // const result = await client.messages.create({
        //     body: message,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: reservation.guestPhone
        // });

        console.log('===== SMS SENT =====');
        console.log('To:', reservation.guestPhone);
        console.log('Message:', message);
        console.log('====================');

        reservation.smsSent = true;
        reservation.smsSentAt = new Date();
        await reservation.save();

        return {
            sent: true,
            provider: 'console', // Change to 'twilio'
            messageId: 'mock-sms-' + Date.now()
        };
    } catch (error) {
        console.error('SMS send error:', error);
        return { sent: false, error: error.message };
    }
}

/**
 * Send reminder SMS (24 hours before)
 */
async function sendReminderSMS(reservationId) {
    try {
        const reservation = await RestaurantReservation.findById(reservationId).populate('restaurantId');
        if (!reservation || !reservation.guestPhone || reservation.reminderSent) {
            return { sent: false, reason: 'Already sent or no phone' };
        }

        const restaurant = reservation.restaurantId;

        const message = `Reminder: ${restaurant.name} reservation tomorrow at ${reservation.time} for ${reservation.partySize}. Confirmation: ${reservation.confirmationNumber}`;

        // **INTEGRATION POINT**: Replace with Twilio
        console.log('===== REMINDER SMS =====');
        console.log('To:', reservation.guestPhone);
        console.log('Message:', message);
        console.log('========================');

        reservation.reminderSent = true;
        reservation.reminderSentAt = new Date();
        await reservation.save();

        return { sent: true, provider: 'console', messageId: 'mock-sms-' + Date.now() };
    } catch (error) {
        console.error('Reminder SMS error:', error);
        return { sent: false, error: error.message };
    }
}

/**
 * Send waitlist notification SMS
 */
async function sendWaitlistNotificationSMS(waitlistId) {
    try {
        const waitlist = await Waitlist.findById(waitlistId).populate('restaurantId');
        if (!waitlist || !waitlist.guestPhone) {
            return { sent: false, reason: 'No phone number' };
        }

        const restaurant = waitlist.restaurantId;

        const message = `${restaurant.name}: Your table is ready! Please arrive within 15 minutes. Party of ${waitlist.partySize}.`;

        // **INTEGRATION POINT**: Replace with Twilio
        console.log('===== WAITLIST SMS =====');
        console.log('To:', waitlist.guestPhone);
        console.log('Message:', message);
        console.log('========================');

        waitlist.status = 'Notified';
        waitlist.notifiedAt = new Date();
        waitlist.notificationMethod = 'SMS';
        await waitlist.save();

        return { sent: true, provider: 'console', messageId: 'mock-sms-' + Date.now() };
    } catch (error) {
        console.error('Waitlist SMS error:', error);
        return { sent: false, error: error.message };
    }
}

/**
 * Twilio webhook handler for incoming SMS (for future two-way communication)
 */
function handleIncomingSMS(req, res) {
    try {
        const { From, Body, MessageSid } = req.body;

        console.log('===== INCOMING SMS =====');
        console.log('From:', From);
        console.log('Body:', Body);
        console.log('MessageSid:', MessageSid);
        console.log('========================');

        // **INTEGRATION POINT**: Process incoming SMS
        // Could be used for:
        // - Confirming reservations via SMS
        // - Cancelling reservations
        // - Joining waitlist
        // - etc.

        res.status(200).send('SMS received');
    } catch (error) {
        console.error('Incoming SMS error:', error);
        res.status(500).send('Error processing SMS');
    }
}

module.exports = {
    sendConfirmationSMS,
    sendReminderSMS,
    sendWaitlistNotificationSMS,
    handleIncomingSMS
};
