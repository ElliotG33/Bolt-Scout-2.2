import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: string;
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  planId: {
    type: String,
    // enum: ['starter', 'professional', 'enterprise'],
    required: [true, 'Plan ID is required'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'canceled', 'expired'],
    default: 'active',
  },
  remarks:{
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: new Date() },
});

SubscriptionSchema.pre('save', function (next) {
  this.updatedAt = new Date();

  const { startDate } = this;
  this.endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); //add 30 days

  next();
});

const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
