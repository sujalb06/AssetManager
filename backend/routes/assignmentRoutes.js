const express = require('express');
const router = express.Router();

const { assignAsset, returnAsset, getAssignments } = require('../controllers/assignmentController');

router.post('/', assignAsset);
router.get('/', getAssignments);
// Notice the :id in the URL. This allows us to pass a specific assignment ID in the web address
router.put('/:id/return', returnAsset); 

module.exports = router;