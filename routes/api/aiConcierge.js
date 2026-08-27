const express = require('express');
const router = express.Router();
const aiConciergeCtrl = require('../../controllers/api/aiConcierge');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const requireRole = require('../../config/requireRole');

// Public routes (no auth required for guest access)
router.post('/start', aiConciergeCtrl.startConversation);
router.post('/verify', aiConciergeCtrl.verifyGuest);
router.post('/chat', aiConciergeCtrl.chat);
router.post('/end', aiConciergeCtrl.endConversation);

// Admin routes (require manager or admin role)
router.get('/conversations', ensureLoggedIn, requireRole('manager', 'admin'), aiConciergeCtrl.getConversations);
router.get('/conversations/:id', ensureLoggedIn, requireRole('manager', 'admin'), aiConciergeCtrl.getConversation);
router.get('/stats', ensureLoggedIn, requireRole('manager', 'admin'), aiConciergeCtrl.getStats);

module.exports = router;
