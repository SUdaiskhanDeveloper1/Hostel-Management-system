const express = require('express');
const router = express.Router();
const { getWorkerPayments, createWorkerPayment, updateWorkerPayment, deleteWorkerPayment } = require('../controllers/workerPaymentController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getWorkerPayments).post(protect, createWorkerPayment);
router.route('/:id').put(protect, updateWorkerPayment).delete(protect, deleteWorkerPayment);

module.exports = router;
