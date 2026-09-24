const Restaurant = require('../../models/restaurant');
const { generateAllTableQRCodes, generateMenuQRCode } = require('../../services/qrCodeService');

module.exports = {
    async index(req, res) {
        try {
            const restaurants = await Restaurant.find().sort({ name: 1 });
            res.json(restaurants);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async show(req, res) {
        try {
            const restaurant = await Restaurant.findById(req.params.id);
            if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
            res.json(restaurant);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const restaurant = await Restaurant.create({
                ...req.body,
                createdBy: req.user.name
            });
            res.status(201).json(restaurant);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const restaurant = await Restaurant.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
            res.json(restaurant);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
            if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
            res.json({ message: 'Restaurant deleted' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async addTable(req, res) {
        try {
            const restaurant = await Restaurant.findById(req.params.id);
            if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
            
            restaurant.tables.push(req.body);
            await restaurant.save();
            res.json(restaurant);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async removeTable(req, res) {
        try {
            const restaurant = await Restaurant.findById(req.params.id);
            if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
            
            restaurant.tables = restaurant.tables.filter(t => t._id.toString() !== req.params.tableId);
            await restaurant.save();
            res.json(restaurant);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async generateQRCodes(req, res) {
        try {
            const result = await generateAllTableQRCodes(req.params.id);
            const restaurant = await Restaurant.findById(req.params.id);
            res.json({ ...result, restaurant });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async generateMenuQR(req, res) {
        try {
            const qrCode = await generateMenuQRCode(req.params.id);
            const restaurant = await Restaurant.findById(req.params.id);
            restaurant.menuQrCode = qrCode;
            await restaurant.save();
            res.json({ qrCode, restaurant });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
