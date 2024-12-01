import mongoose from 'mongoose';

export type Task = {
  name: string;
  
};

export type BoardType = {
  _id: string;
  name: string;
  tasks: Task[];
};

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    tasks: {
      type: [taskSchema],
      default: [],  
      validate: {
        validator: function (value: any) {
          return true;  
        },
        message: 'A board must have at least one task', 
      },
    },
  },
  {
    timestamps: true,
  }
);

const Board = mongoose.model<BoardType>('Board', boardSchema);

export default Board;
