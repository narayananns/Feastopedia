import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/user.js';
import OTP from '../models/otp.js';

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Standard for personal projects
  auth: {
    user: process.env.EMAIL_USER, // User needs to set this
    pass: process.env.EMAIL_PASS  // User needs to set this
  }
});

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
     // Check if user already exists
     const existingUser = await User.findOne({ email });
     if (existingUser) {
       return res.status(400).json({ message: 'User already exists' });
     }

     // Generate 6 digit OTP
     const otp = Math.floor(100000 + Math.random() * 900000).toString();
     
     // Save query - delete any existing OTP for this email first
     await OTP.findOneAndDelete({ email });
     
     const newOtp = new OTP({ email, otp });
     await newOtp.save();

     // Send Email
     if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'FeastoPedia Email Verification',
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #f97316;">FeastoPedia Verification</h2>
                    <p>Your verification code is:</p>
                    <h1 style="font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                    <p>This code will expire in 5 minutes.</p>
                   </div>`
          });
          console.log(`OTP sent to ${email}`);
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          // Fallback to console for development if email fails
          console.log(`[FALLBACK] Email failed. OTP for ${email}: ${otp}`);
          // We still return success so the flow doesn't break, but log the error on server
        }
     } else {
        // Fallback for development without credentials
        console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
     }

     res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP Send Error:', error);
    res.status(500).json({ message: 'Failed to generate OTP' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await OTP.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    // We don't delete it immediately so the user can potentially retry if the frontend glitched, 
    // or we delete it. Let's delete it to prevent replay.
    await OTP.deleteOne({ _id: record._id });
    
    res.status(200).json({ message: 'Email verified successfully' });
  } catch(error) {
     console.error('OTP Verify Error:', error);
     res.status(500).json({ message: 'Verification failed' });
  }
};

// Register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};