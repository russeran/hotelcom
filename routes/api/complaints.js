const express = require('express')
const router = express.Router()
const complaintsCtrl = require('../../controllers/api/complaints')

router.post('/create', complaintsCtrl.create)
router.get('/index', complaintsCtrl.index)
router.delete('/delete/:id', complaintsCtrl.delete)
router.patch('/update/:id', complaintsCtrl.update)


// const {
//     createComplaint,
//     getAllComplaints,
//     getOneComplaint,
//     deleteComplaint,
//     updateComplaint

// } = require('../../controllers/api/users')


// const router = express.Router()


// //GET ALL COMPLAINTS
// router.get('/', getAllComplaints)

// //GET ONE COMPLAINT
// router.get('/:id', getOneComplaint)

// //CREATE ONE COMPLAINT
// router.post('/', createComplaint)

// //DELETE ONE COMPLAINT
// router.delete('/:id', deleteComplaint)

// //UPDATE ONE COMPLAINT
// router.patch('/:id', updateComplaint),

module.exports = router;