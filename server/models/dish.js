import mongoose from 'mongoose';

const dishSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [String],
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Dish = mongoose.model('Dish', dishSchema);

export default Dish;