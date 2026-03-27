const express = require('express');
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getRooms)
  .post(protect, createRoom);

router.route('/:id')
  .put(protect, updateRoom)
  .delete(protect, deleteRoom);

module.exports = router;
