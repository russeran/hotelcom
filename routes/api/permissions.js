const express = require('express');
const router = express.Router();
const permissionsCtrl = require('../../controllers/api/permissions');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const requireRole = require('../../config/requireRole');

router.use(ensureLoggedIn);
router.use(requireRole('admin')); // Only admins can manage permissions

router.get('/index', permissionsCtrl.index);
router.get('/get', permissionsCtrl.getPermission);
router.post('/create', permissionsCtrl.create);
router.put('/:id', permissionsCtrl.update);
router.delete('/:id', permissionsCtrl.delete);
router.post('/initialize-defaults', permissionsCtrl.initializeDefaults);

module.exports = router;
