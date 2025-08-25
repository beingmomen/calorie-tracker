const Model = require('../models/recordModel');
const factory = require('./handlerFactory');

// Image handling middleware

// CRUD operations with image support
exports.createOne = factory.createOne(Model);
exports.updateOne = factory.updateOne(Model);
exports.deleteOne = factory.deleteOne(Model);

// Factory methods for standard operations
exports.getAllNoPagination = factory.getAllNoPagination(Model);
exports.getAll = factory.getAll(Model);
exports.getOne = factory.getOne(Model);
exports.deleteAll = factory.deleteAll(Model);
