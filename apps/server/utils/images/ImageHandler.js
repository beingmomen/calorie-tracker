// const mongoose = require('mongoose');
const imageService = require('./ImageService');
const catchAsync = require('../catchAsync');
const AppError = require('../appError');

/**
 * Handles image-related operations for Express routes
 * Provides middleware for uploading, processing, and managing images
 * @class ImageHandler
 */
class ImageHandler {
  /**
   * Creates an instance of ImageHandler
   * @param {Object} Model - Mongoose model
   * @param {string} folderName - Subfolder name for storing images
   * @param {Array} imageFields - Configuration for image fields
   * @param {string} imageFields[].name - Form field name
   * @param {number} imageFields[].maxCount - Maximum number of files
   * @param {Object} imageFields[].resize - Sharp resize options
   */
  constructor(Model, folderName, imageFields) {
    this.Model = Model;
    this.folderName = folderName;
    this.imageFields = imageFields;
    this.upload = imageService.upload; // Expose multer upload instance directly
  }

  /**
   * Creates multer middleware for handling file uploads
   * @returns {Function} Express middleware
   */
  uploadImages() {
    return imageService.upload.fields(this.imageFields);
  }

  /**
   * Processes uploaded images using Sharp
   * @returns {Function} Express middleware
   */
  processImages() {
    return catchAsync(async (req, res, next) => {
      if (!req.files) return next();

      req.processedImages = {};

      await Promise.all(
        this.imageFields.map(async ({ name: fieldName, resize }) => {
          if (!req.files[fieldName]) return;

          const files = Array.isArray(req.files[fieldName])
            ? req.files[fieldName]
            : [req.files[fieldName]];

          const processedFiles = await Promise.all(
            files.map(async (file, index) => {
              const filename = imageService.generateFilename(
                this.folderName,
                fieldName,
                req.params.id || req.user.id,
                index
              );

              const processedBuffer = await imageService.processImage(
                file.buffer,
                resize
              );

              const fullPath = `/images/${this.folderName}/${filename}`;

              return {
                filename,
                fullPath,
                buffer: processedBuffer
              };
            })
          );

          req.processedImages[fieldName] = processedFiles;
          req.body[fieldName] =
            processedFiles.length === 1
              ? processedFiles[0].fullPath
              : processedFiles.map(img => img.fullPath);
        })
      );

      next();
    });
  }

  /**
   * Saves processed images to disk
   * @param {Object} processedImages - Object containing processed image buffers
   * @returns {Promise<void>}
   */
  async saveProcessedImages(processedImages) {
    await Promise.all(
      Object.entries(processedImages).map(async ([, images]) => {
        await Promise.all(
          images.map(image =>
            imageService.saveImage(
              image.buffer,
              image.filename,
              this.folderName
            )
          )
        );
      })
    );
  }

  /**
   * Removes old images when updating
   * @param {Object} oldDoc - Previous document
   * @param {Object} newDoc - Updated document
   * @param {Object} req - Express request object
   * @returns {Promise<void>}
   */
  async removeExistingImages(oldDoc, newDoc, req) {
    await Promise.all(
      this.imageFields
        .filter(
          ({ name: fieldName }) =>
            oldDoc[fieldName] &&
            fieldName in req.body &&
            oldDoc[fieldName] !== newDoc[fieldName]
        )
        .map(async ({ name: fieldName }) => {
          const oldImages = Array.isArray(oldDoc[fieldName])
            ? oldDoc[fieldName]
            : [oldDoc[fieldName]];

          await Promise.all(
            oldImages.map(oldImage => {
              const filename = oldImage.split('/').pop();
              return imageService.deleteImage(filename, this.folderName);
            })
          );
        })
    );
  }

  /**
   * Creates a new document with images
   * @returns {Function} Express middleware
   */
  createOne() {
    return catchAsync(async (req, res, next) => {
      if (!req.files && !req.file) return next();

      const doc = await this.Model.create({ ...req.body, user: req.user._id });

      if (req.processedImages) {
        await this.saveProcessedImages(req.processedImages);
      }

      res.status(201).json({
        status: 'success',
        data: doc
      });
    });
  }

  /**
   * Updates an existing document and its images
   * @returns {Function} Express middleware
   */
  updateOne() {
    return catchAsync(async (req, res, next) => {
      const doc = await this.Model.findById(req.params.id);
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      if (req.processedImages) {
        await this.removeExistingImages(doc, req.body, req);
        await this.saveProcessedImages(req.processedImages);
      }

      const updatedDoc = await this.Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      res.status(200).json({
        status: 'success',
        data: updatedDoc
      });
    });
  }

  /**
   * Deletes a document and its associated images
   * @returns {Function} Express middleware
   */
  deleteOne() {
    return catchAsync(async (req, res, next) => {
      const doc = await this.Model.findById(req.params.id);
      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      // Delete associated images first
      await Promise.all(
        this.imageFields
          .filter(({ name: fieldName }) => doc[fieldName])
          .map(async ({ name: fieldName }) => {
            const images = Array.isArray(doc[fieldName])
              ? doc[fieldName]
              : [doc[fieldName]];

            await Promise.all(
              images.map(image => {
                const filename = image.split('/').pop();
                return imageService.deleteImage(filename, this.folderName);
              })
            );
          })
      );

      await doc.deleteOne();

      res.status(200).json({
        status: 'success',
        message: 'Deleted successfully'
      });
    });
  }
}

module.exports = ImageHandler;
