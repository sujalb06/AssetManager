const express = require('express');
const router = express.Router();

const { logMaintenance, resolveMaintenance, getMaintenanceLogs } = require('../controllers/maintenanceController');

router.post('/', logMaintenance);
router.get('/', getMaintenanceLogs);
router.put('/:id/resolve', resolveMaintenance);

module.exports = router;