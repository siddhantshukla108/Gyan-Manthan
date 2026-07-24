const mongoose = require('mongoose');

const readingPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  durationDays: { type: Number, required: true }, // e.g. 7, 15, 30
  readingMode: { type: String, enum: ['Fast Track', 'Deep Study', 'Exam', 'Spiritual', 'Productivity'], default: 'Deep Study' },
  language: { type: String, default: 'English' }
}, { timestamps: true });

module.exports = mongoose.model('ReadingPlan', readingPlanSchema);
