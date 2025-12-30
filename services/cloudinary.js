const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file to Cloudinary with organized folders by date
 * @param {string} filePath - Local file path
 * @param {string} originalFileName - Original filename
 * @param {string} eventDate - Event date (YYYY-MM-DD)
 * @param {object} metadata - User metadata (name, transactionId, phoneNumber)
 */
async function uploadToCloudinary(filePath, originalFileName, eventDate, metadata) {
    try {
        // Create unique filename with shop name
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const sanitizedShopName = metadata.shopName.replace(/[^a-zA-Z0-9]/g, '_');
        const extension = path.extname(originalFileName).toLowerCase();
        const publicId = `${sanitizedShopName}_${timestamp}`;

        // Upload to Cloudinary
        // Folder structure: Anokha_Payments/YYYY-MM-DD/filename
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `Anokha_Payments/${eventDate}`,
            public_id: publicId,
            resource_type: 'auto', // Auto-detect file type
            context: {
                shopName: metadata.shopName,
                uploadDate: new Date().toISOString()
            },
            tags: [eventDate, 'payment', metadata.shopName]
        });

        console.log(`File uploaded to Cloudinary: ${eventDate}/${publicId}${extension}`);
        
        return {
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            size: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload to Cloudinary: ' + error.message);
    }
}

/**
 * Get all uploads for a specific event date
 * @param {string} eventDate - Event date (YYYY-MM-DD)
 */
async function getUploadsByDate(eventDate) {
    try {
        const result = await cloudinary.search
            .expression(`folder:Anokha_Payments/${eventDate}`)
            .sort_by('created_at', 'desc')
            .max_results(500)
            .execute();
        
        return result.resources;
    } catch (error) {
        console.error('Error fetching uploads:', error);
        throw error;
    }
}

/**
 * Verify Cloudinary connection
 */
async function verifyConnection() {
    try {
        await cloudinary.api.ping();
        console.log('✓ Cloudinary connection successful');
        return true;
    } catch (error) {
        console.error('✗ Cloudinary connection failed:', error.message);
        return false;
    }
}

module.exports = {
    uploadToCloudinary,
    getUploadsByDate,
    verifyConnection
};
