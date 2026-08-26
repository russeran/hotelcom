const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../../models/user')
const audit = require('./audit')

module.exports = {
    create,
    login,
    checkToken,
    refreshToken,
    uploadAvatar,
    index,
    directory,
    updateRole,
    delete: deleteUser
}

// Lightweight roster (name + department) any signed-in user can read, e.g. to
// populate an assignee dropdown. Excludes emails/roles.
async function directory(req, res) {
    const users = await User.find({}, 'name department').sort({ name: 1 })
    res.json(users)
}

// Re-issue a JWT from the current DB state so role/department changes (made by
// an admin) propagate to an already-logged-in client without a manual re-login.
async function refreshToken(req, res) {
    try {
        if (!req.user) return res.status(401).json('Unauthorized')
        const user = await User.findById(req.user._id)
        if (!user) return res.status(401).json('User no longer exists')
        res.json(createJWT(user))
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
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

        // Guard against admin lockout: don't let an admin demote themselves,
        // and don't allow removing the last remaining admin.
        if (updates.role && updates.role !== 'admin') {
            if (req.params.id === req.user._id) {
                return res.status(400).json('You cannot change your own role')
            }
            const target = await User.findById(req.params.id)
            if (target && target.role === 'admin') {
                const adminCount = await User.countDocuments({ role: 'admin' })
                if (adminCount <= 1) return res.status(400).json('Cannot remove the last admin')
            }
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
        if (!user) return res.status(404).json('User not found')
        await audit.record({ req, action: 'role_change', entity: 'user', entityId: user._id, details: `${user.name} → role=${user.role}${user.department ? ', dept=' + user.department : ''}` })
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
    await audit.record({ req, action: 'delete', entity: 'user', entityId: user._id, details: `${user.name} (${user.email})` })
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
