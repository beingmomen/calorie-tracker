const express = require('express');
const controller = require('../controllers/_recordController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(controller.getAll).post(controller.createOne);

router.route('/all').get(controller.getAllNoPagination);
router
  .route('/delete-all')
  .delete(
    authController.protect,
    authController.restrictTo(['dev']),
    controller.deleteAll
  );

router
  .route('/:id')
  .get(controller.getOne)
  .patch(
    authController.protect,
    authController.restrictTo(['admin', 'dev']),
    controller.updateOne
  )
  .delete(controller.deleteOne);

module.exports = router;
