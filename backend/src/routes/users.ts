import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import multer from "multer";
import cloudinary from "cloudinary";
import streamifier from "streamifier";
import bcrypt from 'bcryptjs';  
import nodemailer from "nodemailer";
import crypto from "crypto"; // For generating random reset token

const router = express.Router();

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed."));
    }
    cb(null, true);
  },
});

// Function to upload image to Cloudinary using streamifier
const uploadToCloudinary = (file: Express.Multer.File) =>
  new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: "profile_photos" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || "");
      }
    );

    // Create a readable stream from the file buffer and pipe it to Cloudinary
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });

// User registration route
router.post(
  "/register",
  upload.single("profilephoto"), // Handle single file upload
  [
    check("name", "Name is required").isString(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({ min: 6 }),
    check("country", "Country is required").isString(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, country } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         res.status(400).json({ error: "User already exists" });
      }

      let profilePhotoUrl = "";
      if (req.file) {
        // Upload profile photo to Cloudinary if a file is provided
        profilePhotoUrl = await uploadToCloudinary(req.file);
      }

      const newUser = new User({
        name,
        email,
        password, // Ensure password is hashed properly before saving
        country,
        profilephoto: profilePhotoUrl, // Save the Cloudinary URL to the database
      });

      await newUser.save();

      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET_KEY!, {
        expiresIn: "1d",
      });

      res.status(201).json({ message: "User registered successfully", token, user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Profile update route
router.put(
  "/profile/edit",
  verifyToken, // Ensure the user is authenticated
  upload.single("profilephoto"), // Handle file upload
  async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId);
      if (!user) {
         res.status(404).json({ error: "User not found" });
         return;
      }

      const { name, email, country } = req.body;

      if (name) user.name = name;
      if (email) user.email = email;
      if (country) user.country = country;

      if (req.file) {
        // Upload the new profile photo to Cloudinary
        const profilePhotoUrl = await uploadToCloudinary(req.file);
        user.profilephoto = profilePhotoUrl;
      }

      await user.save();
      res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Fetch user profile route
router.get("/profile", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
       res.status(404).json({ error: "User not found" });
    }

    res.status(200).json( user );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


router.post(
  "/forgot-password",
  [check("email", "Valid email is required").isEmail()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
     
      const user = await User.findOne({ email });
      if (!user) {
         res.status(404).json({ error: "User not found" });
         return;
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = await bcrypt.hash(resetToken, 10);
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = Date.now() + 3600000; 
      await user.save();

      // Send reset link with the token
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        text: `You requested a password reset. Please click on the link below to reset your password:\n\n${resetLink}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);


router.post(
  "/reset-password/:token",
  [check("password", "Password must be at least 6 characters long").isLength({ min: 6 })],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;
    const { token } = req.params;

    try {
      const user = await User.findOne({ resetPasswordToken: token });
      if (!user) {
         res.status(404).json({ error: "Invalid or expired reset token" });
         return;
      }

      
      if (user.resetPasswordExpire && user.resetPasswordExpire < Date.now()) {
         res.status(400).json({ error: "Reset token has expired" });
      }

      
      if (user.resetPasswordToken) {
        const isValidToken = await bcrypt.compare(token, user.resetPasswordToken);
        if (!isValidToken) {
           res.status(400).json({ error: "Invalid reset token" });
        }
      } else {
         res.status(400).json({ error: "Invalid reset token" });
      }

    
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;


      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(200).json({ message: "Password successfully updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
export default router;
