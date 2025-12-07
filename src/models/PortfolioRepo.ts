import mongoose, { Schema, model, models } from 'mongoose';

const PortfolioRepoSchema = new Schema({
  githubId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  homepage: { type: String },
  language: { type: String },
  stars: { type: Number, default: 0 },
  size: { type: Number, default: 0 }, // Size in KB
  updatedAt: { type: Date, required: true },
  isVisible: { type: Boolean, default: true },
  longDescription: { type: String },
  features: { type: [String] },
  teamInfo: { type: String },
});

const PortfolioRepo = models.PortfolioRepo || model('PortfolioRepo', PortfolioRepoSchema);

export default PortfolioRepo;
