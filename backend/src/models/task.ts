import mongoose, { Document, Schema } from 'mongoose';

export interface Task extends Document {
  title: string;
  description?: string;
  status?: string;
  boardId: mongoose.Types.ObjectId; 
}

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    boardId: { type: mongoose.Types.ObjectId, ref: 'Board', required: true }, 
  },
  { timestamps: true }
);


taskSchema.virtual('id').get(function (this: any) {
  return this._id.toString();
});

const Task = mongoose.model<Task>('Task', taskSchema);

export default Task;
