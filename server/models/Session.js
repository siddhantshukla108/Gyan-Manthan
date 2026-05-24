const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'ReadingPlan', required: true },
  dayNumber: { type: Number, required: true },
  content: { type: String }, // Raw or chunked text to read
  summary: { type: String }, // AI simplified summary
  keyIdea: { type: String },
  metaphor: { type: String },
  implementationTask: { type: String },
  reflectionQuestion: { type: String },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
