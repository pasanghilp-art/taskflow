const express = require('express');
const { createBoard, getBoards } = require('../controllers/board.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.use(protect);
router.post('/', createBoard);
router.get('/:workspaceId', getBoards);

module.exports = router;