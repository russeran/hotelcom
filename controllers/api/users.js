const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../../models/user')

module.exports = {
    create,
    login,
    checkToken,
    uploadAvatar,
    index,
    updateRole,
    delete: deleteUser
}

async function create(req, res) {
    try {
        // Never trust a client-provided role. Bootstrap the very first admin:
        // if no admin exists yet, this account becomes the admin; otherwise staff.
        const adminCount = await User.countDocuments({ role: 'admin' })
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            department: req.body.department,
            role: adminCount === 0 ? 'admin' : 'staff'
        })
        const token = createJWT(user)
        res.json(token)
    } catch(err) {
        console.log(err)
        res.status(400).json(err)
    }
}

/*-- Admin user management (admin-only; guarded at the route) --*/

async function index(req, res) {
    const users = await User.find({}).sort({ createdAt: 1 })
    res.json(users)
}

async function updateRole(req, res) {
    try {
        const updates = {}
        if (req.body.role !== undefined) updates.role = req.body.role
        if (req.body.department !== undefined) updates.department = req.body.department
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
        if (!user) return res.status(404).json('User not found')
        res.json(user)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}

async function deleteUser(req, res) {
    // Prevent an admin from deleting their own account (avoids lockout foot-guns).
    if (req.user._id === req.params.id) return res.status(400).json('You cannot delete your own account')
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json('User not found')
    res.json(user)
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email })
        if(!user) throw new Error('Invalid Credentials')
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = createJWT(user)
            res.json(token)
        } else {
            throw new Error('Invalid Credentials')
        }
    } catch(err) {
        console.log(err)
        res.status(400).json(err)
    }
}

function checkToken(req, res) {
    console.log('req.user', req.user )
    res.json(req.exp)
}

async function uploadAvatar(req, res) {
    try {
        if (!req.file) return res.status(400).json('No file uploaded')
        const avatarPath = `/uploads/${req.file.filename}`
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: avatarPath },
            { new: true }
        )
        if (!user) return res.status(404).json('User not found')
        // Re-issue a JWT so the client picks up the new avatar (the client
        // derives the current user from the token payload).
        const token = createJWT(user)
        res.json(token)
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}


/*-- Helper Functions --*/

function createJWT(user) {
    return jwt.sign(
        { user },
        process.env.SECRET,
        { expiresIn: '24h' }
    )
}
