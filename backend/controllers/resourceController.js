
const Resource = require('../models/resource.cjs');

// GET /api/resources - filter by query parameters
exports.getResources = async (req, res) => {
  try {
    const filter = {};

    // Add filters dynamically from query
    if (req.query.course) filter.course = req.query.course;
    if (req.query.year) filter.year = parseInt(req.query.year);
    if (req.query.semester) filter.semester = parseInt(req.query.semester);
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.type) filter.type = req.query.type;

    
    // Sorting
  const sortField = req.query.sort;
  const sortOrder = req.query.order === 'asc' ? 1 : -1; // Default is descending
  const sortOption = {};

  if (sortField === 'views' || sortField === 'rating') {
    sortOption[sortField] = sortOrder;
  }

  // Execute query with sorting
  const resources = await Resource.find(filter).sort(sortOption);
  res.json(resources);

  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.incrementViews = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!resource) {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    res.json(resource);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update views' });
  }
};

// GET /api/resources with filtering support

