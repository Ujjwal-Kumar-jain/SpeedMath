import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  category: 'Addition' | 'Subtraction' | 'Multiplication' | 'Division';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionSignature: string; // e.g. "45+12", to ensure uniqueness
  isCorrect: boolean;
  createdAt: Date;
}

const AttemptSchema: Schema<IAttempt> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['Addition', 'Subtraction', 'Multiplication', 'Division'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    questionSignature: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for fast lookups when generating unique questions
AttemptSchema.index({ userId: 1, questionSignature: 1 }, { unique: true });

const Attempt: Model<IAttempt> = mongoose.models.Attempt || mongoose.model<IAttempt>('Attempt', AttemptSchema);

export default Attempt;
