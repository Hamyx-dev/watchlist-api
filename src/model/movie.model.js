import mongoose from 'mongoose';


const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  isWatched: { type: Boolean, default: false },
  rating: { type: Number, min:1, max:5, default: null },
});

export default mongoose.model('Movie', movieSchema);