import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import Board from '../models/board';
import Task from '../models/task';

const router = express.Router();


router.post("/create", verifyToken, async (req: Request, res: Response) => {
  try {
    const { name, task } = req.body;

    const newBoard = new Board({
      name,
      userId: req.userId,
    });

    await newBoard.save();
    if (task && task.length > 0) {
      const boardTasks = task.map((taskItem: any) => ({
        title: taskItem.title,
        description: taskItem.description || '',
        status: taskItem.status || 'TODO',
        boardId: newBoard._id,
      }));

      const createdTasks = await Task.insertMany(boardTasks);
      newBoard.task = createdTasks.map(t => t._id);
      await newBoard.save();

      res.status(201).json({
        message: "Board and tasks created successfully",
        board: {
          ...newBoard.toObject(),
          tasks: createdTasks,
        },
      });
    } else {
      res.status(201).json({
        message: "Board created successfully",
        board: newBoard,
      });
    }
  } catch (error) {
    console.error("Board creation error:", error);
    res.status(500).json({ message: "Something went wrong", error: error instanceof Error ? error.message : error });
  }
});


router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const boards = await Board.find({ userId: req.userId })
      .populate('task')  
      .sort({ createdAt: -1 });

    res.json(boards);
  } catch (error) {
    console.error("Fetch boards error:", error);
    res.status(500).json({ message: "Failed to fetch boards" });
  }
});


router.get("/:boardId", verifyToken, async (req: Request, res: Response) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      userId: req.userId,
    }).populate('task');  

    if (!board) {
       res.status(404).json({ message: "Board not found" });
    }

    res.json(board);
  } catch (error) {
    console.error("Fetch board error:", error);
    res.status(500).json({ message: "Failed to fetch board" });
  }
});


router.put("/:boardId", verifyToken, async (req: Request, res: Response) => {
  try {
    const { name, task } = req.body;

    const board = await Board.findOne({
      _id: req.params.boardId,
      userId: req.userId,
    });

    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    
    board.name = name;
    await board.save();

 
    if (task && task.length > 0) {
      await Task.deleteMany({ boardId: board._id });

      const boardTasks = task.map((taskItem: any) => ({
        title: taskItem.title,
        description: taskItem.description || '',
        status: taskItem.status || 'TODO',
        boardId: board._id,
      }));

      const createdTasks = await Task.insertMany(boardTasks);
      board.task = createdTasks.map(t => t._id);
      await board.save();

      res.json({
        board: {
          ...board.toObject(),
          tasks: createdTasks,
        },
      });
    } else {
      res.json(board); 
    }
  } catch (error) {
    console.error("Board update error:", error);
    res.status(500).json({ message: "Failed to update board" });
  }
});

router.delete("/:boardId", verifyToken, async (req: Request, res: Response) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.boardId,
      userId: req.userId,
    });

    if (!board) {
     res.status(404).json({ message: "Board not found" });
     return;
    }

    await Task.deleteMany({ boardId: board._id });

    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Board delete error:", error);
    res.status(500).json({ message: "Failed to delete board" });
  }
});

export default router;
