const express = require('express');
const { createWorkspace, getWorkspaces } = require('../controllers/workspace.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(protect);
router.post('/', createWorkspace);
router.get('/', getWorkspaces);

module.exports = router;