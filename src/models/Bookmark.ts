import mongoose, { Schema, model, models } from 'mongoose';

const BookmarkSchema = new Schema({
  userId: { type: String, required: true, index: true },
  fileId: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// Prevent recompilation of model in development
const Bookmark = models.Bookmark || model('Bookmark', BookmarkSchema);

export default Bookmark;
