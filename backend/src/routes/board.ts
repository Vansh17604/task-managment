import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import Board from "../models/board";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  [
    check("name", "Board name is required").isString().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    console.log("Create board route hit");  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
    }

    try {
      const newBoard = new Board({
        name: req.body.name,
        tasks: [],
      });

      await newBoard.save();
       res.status(201).json({
        message: "Board created successfully",
        board: newBoard,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
       res.status(404).json({ message: "Board not found" });
    }
    res.json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});



router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.put(
  "/:id/edit",
  verifyToken,
  [
    check("name", "Board name is required").isString().notEmpty(),
  ],
  async (req: Request, res: Response) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
    }

    try {
      const board = await Board.findById(req.params.id);
      if (!board) {
        res.status(404).json({ message: "Board not found" });
        return;
      }

      board.name = req.body.name;
      await board.save();

      res.json({
        message: "Board updated successfully",
        board,
      });
    } catch (error) {
      console.error(error);
       res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.delete("/:id/delete", verifyToken, async (req: Request, res: Response) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      res.status(404).json({ message: "Board not found" });
    }

    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
