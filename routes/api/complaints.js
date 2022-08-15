const express = require('express')
const router = express.Router()
const complaintsCtrl = require('../../controllers/api/complaints')

router.post('/create', complaintsCtrl.create)
router.get('/index', complaintsCtrl.index)
router.delete('/delete/:id', complaintsCtrl.delete)
router.put('/:id', complaintsCtrl.update)



module.exports = router;