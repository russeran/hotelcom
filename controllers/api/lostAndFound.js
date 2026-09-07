const LostAndFound = require('../../models/lostAndFound');

module.exports = {
    async index(req, res) {
        try {
            const { status } = req.query;
            const query = status && status !== 'all' ? { status } : {};
            const items = await LostAndFound.find(query).sort({ dateFound: -1 });
            res.json(items);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async show(req, res) {
        try {
            const item = await LostAndFound.findById(req.params.id);
            if (!item) return res.status(404).json({ error: 'Item not found' });
            res.json(item);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const item = await LostAndFound.create({
                ...req.body,
                foundBy: req.user.name
            });
            res.status(201).json(item);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const item = await LostAndFound.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!item) return res.status(404).json({ error: 'Item not found' });
            res.json(item);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            const item = await LostAndFound.findByIdAndDelete(req.params.id);
            if (!item) return res.status(404).json({ error: 'Item not found' });
            res.json({ message: 'Item deleted' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async claim(req, res) {
        try {
            const item = await LostAndFound.findById(req.params.id);
            if (!item) return res.status(404).json({ error: 'Item not found' });
            
            item.status = 'Claimed';
            item.claimedBy = req.body.claimedBy || req.user.name;
            item.claimedDate = new Date();
            item.claimNotes = req.body.claimNotes;
            await item.save();
            
            res.json(item);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
