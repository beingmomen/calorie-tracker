const mongoose = require('mongoose');
const { slug } = require('../controllers/globalFactory');
const counterPlugin = require('./plugins/counterPlugin');

const schema = new mongoose.Schema(
  {
    meal: {
      type: String,
      required: [true, 'Meal is required'],
      trim: true,
      index: true
    },
    slug: {
      type: String,
      index: true
    },
    original_slug: String,
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    calories: {
      type: Number,
      required: [true, 'Calories is required']
    },
    type: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'snack'],
      default: 'pending',
      required: [false, 'Type is required'],
      index: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: true,
      index: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create compound indexes for common query patterns
schema.index({ slug: 1, user: 1 });
schema.index({ createdAt: -1, name: 1 });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
schema.pre('save', function generateSlug(next) {
  this.original_slug = slug(this.meal);
  next();
});

schema.pre('save', function updateSlug(next) {
  if (this.isModified('meal')) {
    this.slug = slug(this.meal);
  }
  next();
});

schema.pre('findOneAndUpdate', function updateSlugOnUpdate(next) {
  const update = this.getUpdate();
  if (update.meal) {
    update.slug = slug(update.meal);
  }
  next();
});

schema.plugin(counterPlugin);

const Record = mongoose.model('Record', schema);

module.exports = Record;
