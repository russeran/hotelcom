const express = require('express')
const router = express.Router()
const auditCtrl = require('../../controllers/api/audit')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
const requireRole = require('../../config/requireRole')

router.get('/', ensureLoggedIn, requireRole('admin'), auditCtrl.index)

module.exports = router;
