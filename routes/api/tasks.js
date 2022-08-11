const express = require('express')
const router = express.Router()
const tasksCtrl = require('../../controllers/api/tasks')

router.post('/create', tasksCtrl.create)
router.get('/index', tasksCtrl.index)



module.exports = router;