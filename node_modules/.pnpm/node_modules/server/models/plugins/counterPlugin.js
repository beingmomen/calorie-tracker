const mongoose = require('mongoose');

// إنشاء نموذج عداد منفصل
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

const counterPlugin = schema => {
  // Add counter field to schema
  schema.add({
    documentNumber: {
      type: Number,
      unique: true,
      index: true
    }
  });

  // Add pre-save middleware to automatically increment counter
  schema.pre('save', async function (next) {
    if (this.isNew && !this.documentNumber) {
      try {
        const { modelName } = this.constructor;
        let retries = 3;

        while (retries > 0) {
          try {
            // محاولة الحصول على العداد التالي
            const counter = await Counter.findOneAndUpdate(
              { _id: modelName },
              { $inc: { sequence_value: 1 } },
              { new: true, upsert: true }
            );

            this.documentNumber = counter.sequence_value;
            break;
          } catch (error) {
            // إذا كان هناك تضارب في documentNumber، نحاول مرة أخرى
            if (error.code === 11000 && retries > 1) {
              retries -= 1;

              // البحث عن أعلى documentNumber موجود والتحديث
              const lastDoc = await this.constructor.findOne(
                {},
                { documentNumber: 1 },
                { sort: { documentNumber: -1 } }
              );

              const lastDocumentNumber = lastDoc ? lastDoc.documentNumber : 0;

              // تحديث العداد ليكون أكبر من آخر رقم موجود
              await Counter.findOneAndUpdate(
                { _id: modelName },
                { $max: { sequence_value: lastDocumentNumber } },
                { upsert: true }
              );

              continue;
            }
            throw error;
          }
        }

        if (retries === 0) {
          throw new Error(
            'فشل في الحصول على documentNumber فريد بعد عدة محاولات'
          );
        }
      } catch (error) {
        return next(error);
      }
    }
    next();
  });

  // إضافة دالة مساعدة لإعادة تعيين العداد (مفيدة بعد seed)
  schema.statics.resetCounter = async function () {
    const { modelName } = this;

    // البحث عن أعلى documentNumber
    const lastDoc = await this.findOne(
      {},
      { documentNumber: 1 },
      { sort: { documentNumber: -1 } }
    );

    const lastDocumentNumber = lastDoc ? lastDoc.documentNumber : 0;

    // تحديث العداد
    await Counter.findOneAndUpdate(
      { _id: modelName },
      { sequence_value: lastDocumentNumber },
      { upsert: true }
    );

    return {
      modelName,
      resetTo: lastDocumentNumber,
      message: `تم إعادة تعيين العداد لـ ${modelName} إلى ${lastDocumentNumber}`
    };
  };
};

module.exports = counterPlugin;
