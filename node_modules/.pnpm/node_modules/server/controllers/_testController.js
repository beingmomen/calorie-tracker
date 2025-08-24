// const Model = require('../models/sectionModel');
// const factory = require('./handlerFactory');

// exports.getAllNoPagination = factory.getAllNoPagination(Model);

// exports.getAll = factory.getAll(Model);
// exports.getOne = factory.getOne(Model);
// exports.createOne = factory.createOne(Model);
// exports.updateOne = factory.updateOne(Model);
// exports.deleteOne = factory.deleteOne(Model);

// exports.deleteAll = factory.deleteAll(Model);

exports.getAll = async (req, res) => {
  try {
    console.log('test');
    res.status(200).json({
      status: 'success',
      data: []
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.createOne = async (req, res) => {
  try {
    console.log('test post and body :>> ', req.body);
    res.status(200).json({
      status: 'success',
      data: []
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
