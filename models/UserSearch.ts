import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserSearch extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  keywords: [string];
  secondaryKeywords: [string];
  antiKeywords: [string];
  timeFrame: string;
  createdAt: Date;
}

const UserSearchSchema = new Schema<IUserSearch>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'Please provide user id.'],
  },
  keywords: {
    type: [String],
  },
  secondaryKeywords: {
    type: [String],
  },
  antiKeywords: {
    type: [String],
  },
  timeFrame: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const UserSearch: Model<IUserSearch> =
  mongoose.models.UserSearch ||
  mongoose.model<IUserSearch>('UserSearch', UserSearchSchema);
export default UserSearch;
