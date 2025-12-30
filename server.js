require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { uploadToCloudinary, verifyConnection } = require('./services/cloudinary');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Use /tmp directory for uploads in production, local uploads folder for dev
const uploadsDir = process.env.NODE_ENV === 'production' 
    ? '/tmp/uploads' 
    : path.join(__dirname, 'uploads');

// Ensure uploads directory exists
try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
} catch (error) {
    console.error('Could not create uploads directory:', error);
    // Continue anyway, will fail at upload time if needed
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure directory exists before each upload
        try {
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
        } catch (error) {
            console.error('Upload directory error:', error);
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, GIF) and PDF are allowed!'));
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
            // Delete uploaded file if validation fails
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ 
                success: false, 
                message: 'Shop Name is required' 
            });
        }

        // Get current event day
        const eventDay = getEventDay();
        
        // Upload to Cloudinary
        const result = await uploadToCloudinary(
            req.file.path,
            req.file.originalname,
            eventDay.date,
            { shopName }
        );

        // Delete local file after successful upload
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: `Payment screenshot uploaded successfully to Day ${eventDay.day}!`,
            eventDay: eventDay.day,
            url: result.url,
            fileName: path.basename(result.publicId)
        });

    } catch (error) {
        console.error('Upload error:', error);
        
        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ 
            success: false, 
            message: 'Failed to upload file: ' + error.message 
        });
    }
});

// Verify Cloudinary connection on startup
(async () => {
    const connected = await verifyConnection();
    if (!connected) {
        console.error('⚠️  Warning: Cloudinary not configured properly. Check your .env file.');
    }
})();

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📅 Event Days: ${process.env.EVENT_DAY_1}, ${process.env.EVENT_DAY_2}, ${process.env.EVENT_DAY_3}`);
});
