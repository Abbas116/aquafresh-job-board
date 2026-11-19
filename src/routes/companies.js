const router = require('express').Router();
const c = require('../controllers/companyController');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/').get(c.getCompanies).post(c.createCompany);
router.route('/:id').all(validateObjectId).get(c.getCompany).put(c.updateCompany).delete(c.deleteCompany);

module.exports = router;
