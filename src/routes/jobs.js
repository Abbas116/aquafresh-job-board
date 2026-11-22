const router = require('express').Router();
const j = require('../controllers/jobController');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/filters', j.getFilterOptions); // must stay above '/:id'
router.route('/').get(j.getJobs).post(j.createJob);
router.route('/:id').all(validateObjectId).get(j.getJob).put(j.updateJob).delete(j.deleteJob);

module.exports = router;
