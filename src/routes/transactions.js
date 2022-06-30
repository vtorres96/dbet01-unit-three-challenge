const express = require('express');
const router = express.Router();

const transactionsController = require('../controllers/transactionsController');
const { validateToken } = require('../middlewares/validateToken');

router.use(validateToken);

router.get('/', transactionsController.index);
router.get('/extrato', transactionsController.extract);
router.get('/:id', transactionsController.getById);
router.post('/', transactionsController.create);
router.put('/:id', transactionsController.update);
router.delete('/:id', transactionsController.remove);

module.exports = router;