const Package = require('../../models/package');

module.exports = {
    async index(req, res) {
        try {
            const { status } = req.query;
            const query = status && status !== 'all' ? { status } : {};
            const packages = await Package.find(query).sort({ receivedDate: -1 });
            res.json(packages);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async show(req, res) {
        try {
            const pkg = await Package.findById(req.params.id);
            if (!pkg) return res.status(404).json({ error: 'Package not found' });
            res.json(pkg);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const pkg = await Package.create({
                ...req.body,
                receivedBy: req.user.name
            });
            res.status(201).json(pkg);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const pkg = await Package.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!pkg) return res.status(404).json({ error: 'Package not found' });
            res.json(pkg);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            const pkg = await Package.findByIdAndDelete(req.params.id);
            if (!pkg) return res.status(404).json({ error: 'Package not found' });
            res.json({ message: 'Package deleted' });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async markNotified(req, res) {
        try {
            const pkg = await Package.findById(req.params.id);
            if (!pkg) return res.status(404).json({ error: 'Package not found' });
            
            pkg.status = 'Notified';
            pkg.notifiedDate = new Date();
            pkg.notified = true;
            pkg.notificationMethod = req.body.method || 'Phone';
            await pkg.save();
            
            res.json(pkg);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async markPickedUp(req, res) {
        try {
            const pkg = await Package.findById(req.params.id);
            if (!pkg) return res.status(404).json({ error: 'Package not found' });
            
            pkg.status = 'Picked Up';
            pkg.pickedUpDate = new Date();
            pkg.deliveredBy = req.user.name;
            pkg.signedBy = req.body.signedBy;
            await pkg.save();
            
            res.json(pkg);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
};
