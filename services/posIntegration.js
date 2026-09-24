/**
 * POS Integration Service (Integration-Ready)
 * Provides hooks for POS systems like Square, Toast, Clover, etc.
 */

const RestaurantReservation = require('../models/restaurantReservation');
const Restaurant = require('../models/restaurant');

/**
 * Sync reservation to POS system
 * @param {ObjectId} reservationId
 * @returns {Promise<Object>} { synced, posOrderId }
 */
async function syncReservationToPOS(reservationId) {
    try {
        const reservation = await RestaurantReservation.findById(reservationId).populate('restaurantId');
        if (!reservation) throw new Error('Reservation not found');

        const restaurant = reservation.restaurantId;

        // Check if POS integration is enabled
        if (!restaurant.posIntegration || !restaurant.posIntegration.enabled) {
            return { synced: false, reason: 'POS integration not enabled' };
        }

        const posData = {
            provider: restaurant.posIntegration.provider,
            locationId: restaurant.posIntegration.locationId,
            reservation: {
                confirmationNumber: reservation.confirmationNumber,
                guestName: reservation.guestName,
                partySize: reservation.partySize,
                date: reservation.date,
                time: reservation.time,
                tableNumber: reservation.tableNumber
            }
        };

        // **INTEGRATION POINT**: Call POS API based on provider
        let posOrderId = null;

        switch (restaurant.posIntegration.provider) {
            case 'Square':
                posOrderId = await syncToSquare(posData, restaurant.posIntegration.apiKey);
                break;
            case 'Toast':
                posOrderId = await syncToToast(posData, restaurant.posIntegration.apiKey);
                break;
            case 'Clover':
                posOrderId = await syncToClover(posData, restaurant.posIntegration.apiKey);
                break;
            default:
                console.log('===== POS SYNC (Mock) =====');
                console.log('Provider:', posData.provider);
                console.log('Reservation:', posData.reservation);
                console.log('===========================');
                posOrderId = 'mock-pos-' + Date.now();
        }

        // Update reservation
        reservation.posOrderId = posOrderId;
        reservation.posSynced = true;
        reservation.posSyncedAt = new Date();
        await reservation.save();

        return {
            synced: true,
            posOrderId,
            provider: restaurant.posIntegration.provider
        };
    } catch (error) {
        console.error('POS sync error:', error);
        return { synced: false, error: error.message };
    }
}

/**
 * Webhook handler for POS order updates
 * Called by POS system when order status changes
 */
async function handlePOSWebhook(req, res) {
    try {
        const { provider, event, data } = req.body;

        console.log('===== POS WEBHOOK =====');
        console.log('Provider:', provider);
        console.log('Event:', event);
        console.log('Data:', JSON.stringify(data, null, 2));
        console.log('=======================');

        // **INTEGRATION POINT**: Process webhook based on provider and event
        switch (provider) {
            case 'Square':
                await processSquareWebhook(event, data);
                break;
            case 'Toast':
                await processToastWebhook(event, data);
                break;
            case 'Clover':
                await processCloverWebhook(event, data);
                break;
            default:
                console.log('Unknown POS provider:', provider);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('POS webhook error:', error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get order details from POS
 */
async function getPOSOrderDetails(posOrderId, provider, apiKey) {
    // **INTEGRATION POINT**: Fetch order from POS API
    console.log(`Fetching POS order ${posOrderId} from ${provider}`);
    
    // Mock response
    return {
        orderId: posOrderId,
        status: 'pending',
        total: 0,
        items: []
    };
}

// Provider-specific integration functions (to be implemented)

async function syncToSquare(posData, apiKey) {
    // **INTEGRATION POINT**: Square API
    // const { Client, Environment } = require('square');
    // const client = new Client({
    //     accessToken: apiKey,
    //     environment: Environment.Production
    // });
    // const response = await client.ordersApi.createOrder({...});
    // return response.result.order.id;

    return 'square-order-' + Date.now();
}

async function syncToToast(posData, apiKey) {
    // **INTEGRATION POINT**: Toast API
    return 'toast-order-' + Date.now();
}

async function syncToClover(posData, apiKey) {
    // **INTEGRATION POINT**: Clover API
    return 'clover-order-' + Date.now();
}

async function processSquareWebhook(event, data) {
    // **INTEGRATION POINT**: Process Square webhook events
    if (event === 'order.updated') {
        const { orderId, state, totalMoney } = data;
        // Update reservation with order details
        const reservation = await RestaurantReservation.findOne({ posOrderId: orderId });
        if (reservation) {
            reservation.paymentStatus = state === 'COMPLETED' ? 'Paid' : 'Pending';
            reservation.totalAmount = totalMoney?.amount / 100; // cents to dollars
            await reservation.save();
        }
    }
}

async function processToastWebhook(event, data) {
    // **INTEGRATION POINT**: Process Toast webhook events
    console.log('Processing Toast webhook:', event);
}

async function processCloverWebhook(event, data) {
    // **INTEGRATION POINT**: Process Clover webhook events
    console.log('Processing Clover webhook:', event);
}

module.exports = {
    syncReservationToPOS,
    handlePOSWebhook,
    getPOSOrderDetails
};
