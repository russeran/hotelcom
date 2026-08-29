/**
 * Email Service (Integration-Ready)
 * Currently logs emails to console. Replace with actual email provider (SendGrid, AWS SES, etc.)
 */

const RestaurantReservation = require('../models/restaurantReservation');
const Restaurant = require('../models/restaurant');

/**
 * Send reservation confirmation email
 * @param {ObjectId} reservationId
 * @returns {Promise<Object>} { sent, provider, messageId }
 */
async function sendConfirmationEmail(reservationId) {
    try {
        const reservation = await RestaurantReservation.findById(reservationId).populate('restaurantId');
        if (!reservation) throw new Error('Reservation not found');

        const restaurant = reservation.restaurantId;
        
        // Build email content
        const emailData = {
            to: reservation.guestEmail,
            from: restaurant.email || 'reservations@hotel.com',
            subject: `Reservation Confirmation - ${restaurant.name}`,
            html: buildConfirmationEmailHtml(reservation, restaurant),
            text: buildConfirmationEmailText(reservation, restaurant)
        };

        // **INTEGRATION POINT**: Replace this with actual email provider
        // Example for SendGrid:
        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // const result = await sgMail.send(emailData);

        // For now, log to console (development mode)
        console.log('===== EMAIL SENT =====');
        console.log('To:', emailData.to);
        console.log('Subject:', emailData.subject);
        console.log('Body:', emailData.text);
        console.log('=====================');

        // Update reservation
        reservation.emailSent = true;
        reservation.emailSentAt = new Date();
        await reservation.save();

        return {
            sent: true,
            provider: 'console', // Change to 'sendgrid', 'ses', etc.
            messageId: 'mock-' + Date.now()
        };
    } catch (error) {
        console.error('Email send error:', error);
        return { sent: false, error: error.message };
    }
}

/**
 * Send reminder email (24 hours before)
 */
async function sendReminderEmail(reservationId) {
    try {
        const reservation = await RestaurantReservation.findById(reservationId).populate('restaurantId');
        if (!reservation || reservation.reminderSent) return { sent: false, reason: 'Already sent or not found' };

        const restaurant = reservation.restaurantId;

        const emailData = {
            to: reservation.guestEmail,
            from: restaurant.email || 'reservations@hotel.com',
            subject: `Reminder: Your reservation at ${restaurant.name}`,
            html: buildReminderEmailHtml(reservation, restaurant),
            text: buildReminderEmailText(reservation, restaurant)
        };

        // **INTEGRATION POINT**: Replace with actual email provider
        console.log('===== REMINDER EMAIL =====');
        console.log('To:', emailData.to);
        console.log('Subject:', emailData.subject);
        console.log('Body:', emailData.text);
        console.log('=========================');

        reservation.reminderSent = true;
        reservation.reminderSentAt = new Date();
        await reservation.save();

        return { sent: true, provider: 'console', messageId: 'mock-' + Date.now() };
    } catch (error) {
        console.error('Reminder email error:', error);
        return { sent: false, error: error.message };
    }
}

// Email templates
function buildConfirmationEmailHtml(reservation, restaurant) {
    return `
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reservation Confirmed!</h2>
            <p>Dear ${reservation.guestName},</p>
            <p>Your reservation at <strong>${restaurant.name}</strong> has been confirmed.</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Confirmation #:</strong> ${reservation.confirmationNumber}</p>
                <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${reservation.time}</p>
                <p><strong>Party Size:</strong> ${reservation.partySize} guests</p>
                ${reservation.tableNumber ? `<p><strong>Table:</strong> ${reservation.tableNumber}</p>` : ''}
            </div>
            ${reservation.specialRequests ? `<p><strong>Special Requests:</strong> ${reservation.specialRequests}</p>` : ''}
            <p>We look forward to seeing you!</p>
            <p>For changes or cancellations, please contact us at ${restaurant.phone || 'the front desk'}.</p>
        </body>
        </html>
    `;
}

function buildConfirmationEmailText(reservation, restaurant) {
    return `
Reservation Confirmed!

Dear ${reservation.guestName},

Your reservation at ${restaurant.name} has been confirmed.

Confirmation #: ${reservation.confirmationNumber}
Date: ${new Date(reservation.date).toLocaleDateString()}
Time: ${reservation.time}
Party Size: ${reservation.partySize} guests
${reservation.tableNumber ? `Table: ${reservation.tableNumber}\n` : ''}
${reservation.specialRequests ? `Special Requests: ${reservation.specialRequests}\n` : ''}

We look forward to seeing you!

For changes or cancellations, please contact us at ${restaurant.phone || 'the front desk'}.
    `.trim();
}

function buildReminderEmailHtml(reservation, restaurant) {
    return `
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reservation Reminder</h2>
            <p>Hi ${reservation.guestName},</p>
            <p>This is a friendly reminder about your upcoming reservation at <strong>${restaurant.name}</strong>.</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Tomorrow at ${reservation.time}</strong></p>
                <p><strong>Party Size:</strong> ${reservation.partySize} guests</p>
                ${reservation.tableNumber ? `<p><strong>Table:</strong> ${reservation.tableNumber}</p>` : ''}
            </div>
            <p>See you soon!</p>
        </body>
        </html>
    `;
}

function buildReminderEmailText(reservation, restaurant) {
    return `
Reservation Reminder

Hi ${reservation.guestName},

This is a friendly reminder about your upcoming reservation at ${restaurant.name}.

Tomorrow at ${reservation.time}
Party Size: ${reservation.partySize} guests
${reservation.tableNumber ? `Table: ${reservation.tableNumber}\n` : ''}

See you soon!
    `.trim();
}

module.exports = {
    sendConfirmationEmail,
    sendReminderEmail
};
