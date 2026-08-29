const GuestProfile = require('../../models/guestProfile');

module.exports = {
    async index(req, res) {
        try {
            const profiles = await GuestProfile.find().sort({ name: 1 });
            res.json(profiles);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async show(req, res) {
        try {
            const profile = await GuestProfile.findById(req.params.id);
            if (!profile) return res.status(404).json({ error: 'Guest profile not found' });
            res.json(profile);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const profile = await GuestProfile.create({
                ...req.body,
                createdBy: req.user.name
            });
            res.status(201).json(profile);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const profile = await GuestProfile.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!profile) return res.status(404).json({ error: 'Guest profile not found' });
            res.json(profile);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            const profile = await GuestProfile.findByIdAndDelete(req.params.id);
            if (!profile) return res.status(404).json({ error: 'Guest profile not found' });
            res.json({ message: 'Profile deleted' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async search(req, res) {
        try {
            const { q } = req.query;
            const profiles = await GuestProfile.find({
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { email: { $regex: q, $options: 'i' } }
                ]
            }).limit(20);
            res.json(profiles);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async addNote(req, res) {
        try {
            const profile = await GuestProfile.findById(req.params.id);
            if (!profile) return res.status(404).json({ error: 'Guest profile not found' });
            
            profile.notes.push({
                note: req.body.note,
                addedBy: req.user.name,
                date: new Date()
            });
            await profile.save();
            res.json(profile);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
