
const express =  require('express');
const router = express.Router();
const { getResources, incrementViews } = require('../controllers/resourceController.cjs');
// Example route
router.get('/', getResources);
router.patch('/:id/view', incrementViews);
module.exports = router;

