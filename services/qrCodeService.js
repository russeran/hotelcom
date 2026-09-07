/**
 * QR Code Service
 * Generates QR codes for tables and menus
 */

const Restaurant = require('../models/restaurant');

/**
 * Generate QR code data for a table
 * @param {ObjectId} restaurantId
 * @param {String} tableNumber
 * @returns {String} QR code data URL or text
 */
async function generateTableQRCode(restaurantId, tableNumber) {
    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) throw new Error('Restaurant not found');

        // QR code contains URL to menu or ordering system
        // Format: https://hotel.com/restaurant/{restaurantId}/table/{tableNumber}
        const qrData = `${process.env.APP_URL || 'https://hotel.com'}/restaurant/${restaurantId}/table/${tableNumber}`;

        // **INTEGRATION POINT**: Use QR code library to generate actual QR image
        // Example with qrcode library:
        // const QRCode = require('qrcode');
        // const qrImage = await QRCode.toDataURL(qrData);
        // return qrImage;

        // For now, return the data URL (can be used with frontend QR generator)
        return qrData;
    } catch (error) {
        console.error('QR code generation error:', error);
        return null;
    }
}

/**
 * Generate QR code for restaurant menu
 */
async function generateMenuQRCode(restaurantId) {
    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) throw new Error('Restaurant not found');

        // QR code points to menu URL
        const menuUrl = restaurant.menuUrl || `${process.env.APP_URL || 'https://hotel.com'}/restaurant/${restaurantId}/menu`;

        // **INTEGRATION POINT**: Generate actual QR image
        // const QRCode = require('qrcode');
        // const qrImage = await QRCode.toDataURL(menuUrl);
        // return qrImage;

        return menuUrl;
    } catch (error) {
        console.error('Menu QR code generation error:', error);
        return null;
    }
}

/**
 * Generate QR codes for all tables in a restaurant
 */
async function generateAllTableQRCodes(restaurantId) {
    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant || !restaurant.tables || restaurant.tables.length === 0) {
            return { success: false, reason: 'No tables found' };
        }

        let updated = 0;
        for (const table of restaurant.tables) {
            if (!table.qrCodeGenerated) {
                const qrData = await generateTableQRCode(restaurantId, table.number);
                table.qrCode = qrData;
                table.qrCodeGenerated = true;
                updated++;
            }
        }

        if (updated > 0) {
            await restaurant.save();
        }

        return {
            success: true,
            generated: updated,
            total: restaurant.tables.length
        };
    } catch (error) {
        console.error('Bulk QR generation error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get QR code image as base64 (for display/download)
 * **INTEGRATION POINT**: Implement with qrcode library
 */
async function getQRCodeImage(data, options = {}) {
    // Example implementation:
    // const QRCode = require('qrcode');
    // const qrImage = await QRCode.toDataURL(data, {
    //     errorCorrectionLevel: 'M',
    //     type: 'image/png',
    //     width: options.width || 200,
    //     margin: 2
    // });
    // return qrImage;

    // Placeholder: return data URL format
    return `data:text/plain;base64,${Buffer.from(data).toString('base64')}`;
}

module.exports = {
    generateTableQRCode,
    generateMenuQRCode,
    generateAllTableQRCodes,
    getQRCodeImage
};
