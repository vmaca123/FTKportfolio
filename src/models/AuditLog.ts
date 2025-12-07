import mongoose, { Schema, model, models } from 'mongoose';

const AuditLogSchema = new Schema({
  userId: { type: String, required: true, index: true },
  action: { type: String, required: true }, // e.g., "VIEW_FILE", "LOGIN", "EXPORT"
  details: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  prevHash: { type: String }, // For Chain of Custody
  hash: { type: String },     // Current Hash
});

const AuditLog = models.AuditLog || model('AuditLog', AuditLogSchema);

export default AuditLog;
