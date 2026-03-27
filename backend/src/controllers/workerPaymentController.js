const WorkerPayment = require('../models/WorkerPayment');

// @desc    Get all worker payments
// @route   GET /api/worker-payments
// @access  Private
const getWorkerPayments = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    
    const filter = {};
    if (req.query.month) filter.month = req.query.month;
      
    const count = await WorkerPayment.countDocuments(filter);
    const payments = await WorkerPayment.find(filter)
      .sort(req.query.sort ? { [req.query.sort]: req.query.order === 'desc' ? -1 : 1 } : { createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ payments, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a worker payment
// @route   POST /api/worker-payments
// @access  Private
const createWorkerPayment = async (req, res) => {
  try {
    const payment = new WorkerPayment(req.body);
    const createdPayment = await payment.save();
    res.status(201).json(createdPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a worker payment
// @route   PUT /api/worker-payments/:id
// @access  Private
const updateWorkerPayment = async (req, res) => {
  try {
    const payment = await WorkerPayment.findById(req.params.id);

    if (payment) {
      Object.assign(payment, req.body);
      const updatedPayment = await payment.save();
      res.json(updatedPayment);
    } else {
      res.status(404).json({ message: 'Worker payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a worker payment
// @route   DELETE /api/worker-payments/:id
// @access  Private
const deleteWorkerPayment = async (req, res) => {
  try {
    const payment = await WorkerPayment.findById(req.params.id);

    if (payment) {
      await payment.deleteOne();
      res.json({ message: 'Worker payment removed' });
    } else {
      res.status(404).json({ message: 'Worker payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWorkerPayments, createWorkerPayment, updateWorkerPayment, deleteWorkerPayment };
