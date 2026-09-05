const Permission = require('../../models/permission');

async function index(req, res) {
    const { role, department } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (department) filter.department = department;
    
    const permissions = await Permission.find(filter).sort({ role: 1, department: 1 });
    res.json(permissions);
}

async function getPermission(req, res) {
    const { role, department } = req.query;
    
    if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }
    
    let permission = await Permission.findOne({ role, department: department || 'All' });
    
    if (!permission) {
        // Return default permissions
        const defaults = Permission.getDefaultPermissions(role, department || 'All');
        return res.json({
            role,
            department: department || 'All',
            permissions: defaults,
            isActive: true,
            isDefault: true
        });
    }
    
    res.json(permission);
}

async function create(req, res) {
    const { role, department, permissions, description } = req.body;
    
    if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }
    
    // Check if permission already exists
    const existing = await Permission.findOne({ role, department: department || 'All' });
    if (existing) {
        return res.status(400).json({ error: 'Permission set already exists for this role/department combination' });
    }
    
    const permission = await Permission.create({
        role,
        department: department || 'All',
        permissions,
        description,
        createdBy: req.user._id
    });
    
    res.status(201).json(permission);
}

async function update(req, res) {
    const { permissions, isActive, description } = req.body;
    
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
        return res.status(404).json({ error: 'Permission set not found' });
    }
    
    if (permissions) {
        // Merge permissions (deep merge for nested objects)
        if (permissions.pages) {
            permission.permissions.pages = { ...permission.permissions.pages, ...permissions.pages };
        }
        if (permissions.dashboardCards) {
            permission.permissions.dashboardCards = { ...permission.permissions.dashboardCards, ...permissions.dashboardCards };
        }
        if (permissions.actions) {
            permission.permissions.actions = { ...permission.permissions.actions, ...permissions.actions };
        }
    }
    
    if (typeof isActive !== 'undefined') permission.isActive = isActive;
    if (description) permission.description = description;
    
    await permission.save();
    res.json(permission);
}

async function deletePermission(req, res) {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
        return res.status(404).json({ error: 'Permission set not found' });
    }
    
    await permission.deleteOne();
    res.json({ message: 'Permission set deleted' });
}

async function initializeDefaults(req, res) {
    // Create default permission sets for all role/department combinations
    const defaults = [
        { role: 'staff', department: 'Front Desk' },
        { role: 'staff', department: 'Food & Beverage' },
        { role: 'staff', department: 'Housekeeping' },
        { role: 'staff', department: 'Concierge' },
        { role: 'staff', department: 'Maintenance' },
        { role: 'manager', department: 'All' },
        { role: 'admin', department: 'All' }
    ];
    
    const created = [];
    for (const def of defaults) {
        const existing = await Permission.findOne({ role: def.role, department: def.department });
        if (!existing) {
            const perms = Permission.getDefaultPermissions(def.role, def.department);
            const permission = await Permission.create({
                role: def.role,
                department: def.department,
                permissions: perms,
                description: `Default permissions for ${def.role} - ${def.department}`,
                createdBy: req.user._id
            });
            created.push(permission);
        }
    }
    
    res.json({ message: `Initialized ${created.length} default permission sets`, created });
}

module.exports = {
    index,
    getPermission,
    create,
    update,
    delete: deletePermission,
    initializeDefaults
};
