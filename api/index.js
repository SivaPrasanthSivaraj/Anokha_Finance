const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const cors = require('cors');

// Import cloudinary directly to avoid path issues
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use memory storage for serverless (more reliable)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) and PDF are allowed!'));
        }
    }
});

// Helper function to determine event day
function getEventDay() {
    const today = new Date().toISOString().split('T')[0];
    const day1 = process.env.EVENT_DAY_1;
    const day2 = process.env.EVENT_DAY_2;
    const day3 = process.env.EVENT_DAY_3;
    
    if (today === day1) return { day: 1, date: day1 };
    if (today === day2) return { day: 2, date: day2 };
    if (today === day3) return { day: 3, date: day3 };
    
    // For any other day, return Day 0 with actual current date
    return { day: 0, date: today };
}

// API endpoint to get current event day
app.get('/api/event-info', (req, res) => {
    const eventDay = getEventDay();
    res.json({
        success: true,
        eventDay: eventDay.day,
        eventDate: eventDay.date
    });
});

// Upload endpoint
app.post('/api/upload', upload.single('screenshot'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        const { shopName } = req.body;
        
        // Validate required fields
        if (!shopName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Shop Name is required' 
            });
        }

        // Get current event day
        const eventDay = getEventDay();
        
        // Create unique filename with shop name
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const sanitizedShopName = shopName.replace(/[^a-zA-Z0-9]/g, '_');
        const extension = path.extname(req.file.originalname).toLowerCase();
        const publicId = `${sanitizedShopName}_${timestamp}`;
        
        // Upload buffer directly to Cloudinary (no file system needed)
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `Anokha_Payments/${eventDay.date}`,
                    public_id: publicId,
                    resource_type: 'auto',
                    context: {
                        shopName: shopName,
                        uploadDate: new Date().toISOString()
                    },
                    tags: [eventDay.date, 'payment', shopName]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            
            uploadStream.end(req.file.buffer);
        });

        res.json({
            success: true,
            message: `Payment screenshot uploaded successfully to Day ${eventDay.day}!`,
            eventDay: eventDay.day,
            url: result.secure_url,
            fileName: publicId + extension
        });

    } catch (error) {
        console.error('Upload error:', error);

        res.status(500).json({ 
            success: false, 
            message: 'Failed to upload file: ' + error.message 
        });
    }
});

// Export for Vercel serverless
module.exports = app;
