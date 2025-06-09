import mongoose, { Schema } from 'mongoose';
import { Todo } from '@/types/todo';

const todoSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, 'Todo text is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret._id = ret._id.toString();
        ret.createdAt = ret.createdAt.toISOString();
        return ret;
      },
    },
  }
);

// Use type assertion to ensure the model returns Todo type
export default (mongoose.models.Todo || mongoose.model('Todo', todoSchema)) as mongoose.Model<Todo>; 