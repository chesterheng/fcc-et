const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: Date
});

mongoose.model('Exercise', exerciseSchema);