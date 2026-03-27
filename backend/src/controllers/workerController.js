const Worker = require('../models/Worker');

// @desc    Get all workers
// @route   GET /api/workers
// @access  Private
const getWorkers = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    
    // Filtering
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
      
    const count = await Worker.countDocuments({ ...keyword });
    const workers = await Worker.find({ ...keyword })
      .sort(req.query.sort ? { [req.query.sort]: req.query.order === 'desc' ? -1 : 1 } : { createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ workers, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a worker
// @route   POST /api/workers
// @access  Private
const createWorker = async (req, res) => {
  try {
    const worker = new Worker(req.body);
    const createdWorker = await worker.save();
    res.status(201).json(createdWorker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a worker
// @route   PUT /api/workers/:id
// @access  Private
const updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (worker) {
      Object.assign(worker, req.body);
      const updatedWorker = await worker.save();
      res.json(updatedWorker);
    } else {
      res.status(404).json({ message: 'Worker not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a worker
// @route   DELETE /api/workers/:id
// @access  Private
const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (worker) {
      await worker.deleteOne();
      res.json({ message: 'Worker removed' });
    } else {
      res.status(404).json({ message: 'Worker not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getWorkers, createWorker, updateWorker, deleteWorker };
