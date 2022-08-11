const express = require('express')
const router = express.Router()
const conciergesCtrl = require('../../controllers/api/concierges')

router.post('/create', conciergesCtrl.create)
router.get('/index', conciergesCtrl.index)

module.exports = router;