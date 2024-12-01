import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/profilephoto';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 9 * 1024 * 1024 },  
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed.'));
    }
    cb(null, true);
  }
});


router.post("/upload-profilephoto", verifyToken, upload.single("profilephoto"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const userId = req.userId;
    const profilephotoPath = req.file.path;  

    const user = await User.findByIdAndUpdate(
      userId,
      { profilephoto: profilephotoPath },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    res.json({ message: "Profile photo uploaded successfully", user });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      res.status(400).json({ message: `Multer error: ${error.message}` });
    }
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.post(
  "/register",
  [
    check("name", "First Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({ min: 6 }),
    check("country", "Country was not selected").isString(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ message: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
         res.status(400).json({ message: "User already exists" });
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1d" });

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,  // 1 day
      });

      res.status(200).send({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);


router.put("/me/profile", verifyToken, upload.single("profilephoto"), async (req: Request, res: Response) => {
  const userId = req.userId;
  const { name, email, country } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.country = country || user.country;

    if (req.file) {
      user.profilephoto = `/uploads/profilephoto/${req.file.filename}`; 
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      res.status(400).json({ message: `Multer error: ${error.message}` });
    }
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
