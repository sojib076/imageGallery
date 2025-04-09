// src/models/Image.ts
import mongoose, { Schema, Document } from 'mongoose';

interface Image extends Document {
  title: string;
  imageUrl: string;
}

const ImageSchema = new Schema<Image>({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

const Image = mongoose.models.Image || mongoose.model('Image', ImageSchema);

export default Image;
