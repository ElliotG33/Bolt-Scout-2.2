import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAlert extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string; //mongoose.Schema.Types.ObjectId;
  email: string;
  userEmail: string;
  keywords: [string];
  frequency: number;
  active: boolean;
  createdAt: Date;
  lastRun: Date;
}

const AlertSchema = new Schema<IAlert>({
  userId: {
    type: String, //mongoose.Schema.Types.ObjectId,
    // ref: 'User', // Reference to the User model
    required: [true, 'Please provide user id.'],
  },
  userEmail: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
  },
  keywords: {
    type: [String],
    required: [true, 'Please provide keywords.'],
  },
  frequency: {
    type: Number,
    required: [true, 'Please provide frequency.'],
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now },
  lastRun: { type: Date },
});

const Alert: Model<IAlert> =
  mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
export default Alert;
