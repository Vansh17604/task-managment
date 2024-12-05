import mongoose, { Document, Schema } from 'mongoose';
import { Task } from './task';  

export interface BoardType extends Document {
  name: string;
  task: mongoose.Types.ObjectId[];  
  userId: mongoose.Types.ObjectId;  
}

const boardSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    task: [{ type: mongoose.Types.ObjectId, ref: 'Task' }],  
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }  
  },
  { timestamps: true }
);

const Board = mongoose.model<BoardType>('Board', boardSchema);

export default Board;
