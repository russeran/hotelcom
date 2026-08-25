const express = require('express')
const path = require('path')
const multer = require('multer')
const router = express.Router()
const usersCtrl = require('../../controllers/api/users')
const ensureLoggedIn = require('../../config/ensureLoggedIn')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, `avatar-${req.user._id}-${Date.now()}${ext}`)
    }
})
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: function (req, file, cb) {
        cb(null, file.mimetype.startsWith('image/'))
    }
})

router.post('/', usersCtrl.create)
router.post('/login', usersCtrl.login)
router.get('/check-token', ensureLoggedIn, usersCtrl.checkToken)
router.post('/avatar', ensureLoggedIn, upload.single('avatar'), usersCtrl.uploadAvatar)

module.exports = router
