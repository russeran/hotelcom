const express = require('express')
const path = require('path')
const multer = require('multer')
const router = express.Router()
const rateLimit = require('express-rate-limit')
const usersCtrl = require('../../controllers/api/users')
const ensureLoggedIn = require('../../config/ensureLoggedIn')
const requireRole = require('../../config/requireRole')

// Throttle auth endpoints to slow brute-force attempts.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many attempts, please try again later.'
})

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

router.post('/', authLimiter, usersCtrl.create)
router.post('/login', authLimiter, usersCtrl.login)
router.get('/check-token', ensureLoggedIn, usersCtrl.checkToken)
router.get('/refresh-token', ensureLoggedIn, usersCtrl.refreshToken)
router.post('/avatar', ensureLoggedIn, upload.single('avatar'), usersCtrl.uploadAvatar)

// Admin-only user management
router.get('/', ensureLoggedIn, requireRole('admin'), usersCtrl.index)
router.put('/:id/role', ensureLoggedIn, requireRole('admin'), usersCtrl.updateRole)
router.delete('/:id', ensureLoggedIn, requireRole('admin'), usersCtrl.delete)

module.exports = router
