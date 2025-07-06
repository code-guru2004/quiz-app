import mongoose from 'mongoose';

const preparationSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  links: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true },
      type: { type: String, enum: ['video', 'article', 'doc', 'other'], default: 'other' },
      source: { type: String },
    }
  ],
  tags: [String],
}, { timestamps: true });

const Preparation = mongoose.models.Preparation || mongoose.model('Preparation', preparationSchema);
export default Preparation;
