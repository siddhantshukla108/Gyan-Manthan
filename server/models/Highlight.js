const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  selectedText: { type: String, required: true },
  aiExplanation: { type: String }, // AI explanation in user's language
  metaphorType: { type: String },
  practicalApplication: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Highlight', highlightSchema);
