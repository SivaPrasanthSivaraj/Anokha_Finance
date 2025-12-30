# Payment Screenshot Collection System

Automated payment screenshot collection system with **Cloudinary** integration for Anokha Event.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Free Cloudinary account

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Cloudinary** (2 minutes)
   - Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
   - Sign up (no credit card required)
   - Go to Dashboard → Copy credentials

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your Cloudinary credentials and event dates

4. **Run the Server**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Access at: `http://localhost:3000`

## 📋 Cloudinary Setup (2 Minutes)

### Step 1: Create Free Account

1. Go to [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up with email (no credit card needed)
3. Verify your email

### Step 2: Get Credentials

1. After login, you'll see the Dashboard
2. Copy these three values to your `.env` file:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

### Step 3: Configure Event Dates

In `.env` file:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz

EVENT_DAY_1=2026-01-07
EVENT_DAY_2=2026-01-08
EVENT_DAY_3=2026-01-09

PORT=3000
```

That's it! 🎉

## 📱 Features

- ✅ **Responsive Design**: Works perfectly on mobile and desktop
- ✅ **Auto Date-Based Folders**: Creates folders like `Anokha_Payments/2026-01-07/`
- ✅ **Real-time Preview**: Shows image preview before upload
- ✅ **File Validation**: Accepts JPG, PNG, GIF, PDF (max 10MB)
- ✅ **Cloudinary Integration**: Free 25GB storage + 25GB bandwidth/month
- ✅ **Organized Storage**: Files named with `Name_TransactionID_Timestamp`
- ✅ **Metadata Storage**: Stores name, transaction ID, phone number with each file
- ✅ **Minimal User Effort**: Just 3 fields + file selection
- ✅ **No Authentication Hassle**: Simple API key setup

## 🗂️ Folder Structure in Cloudinary

```
Anokha_Payments/
├── 2026-01-07/
│   ├── John_Doe_TXN123_2026-01-07T10-30-00.jpg
│   ├── Jane_Smith_TXN124_2026-01-07T11-15-00.jpg
│   └── ...
├── 2026-01-08/
│   ├── ...
└── 2026-01-09/
    └── ...
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `CLOUDINARY_CLOUD_NAME` | Your cloud name | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | API Key | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | API Secret | Cloudinary Dashboard |
| `EVENT_DAY_1` | First event date | Set manually (YYYY-MM-DD) |
| `EVENT_DAY_2` | Second event date | Set manually (YYYY-MM-DD) |
| `EVENT_DAY_3` | Third event date | Set manually (YYYY-MM-DD) |
| `PORT` | Server port | Default: 3000 |

## 📤 How It Works

1. User opens form on mobile/desktop
2. Fills name, transaction ID, and uploads screenshot
3. Backend detects current date and determines event day
4. File uploads to Cloudinary in folder: `Anokha_Payments/YYYY-MM-DD/`
5. File renamed: `Name_TransactionID_Timestamp.jpg`
6. Metadata (name, transaction ID, phone) stored with file
7. User gets instant confirmation
8. Local temp file deleted

## 📊 View Your Uploads

Go to Cloudinary Dashboard → Media Library → Navigate to `Anokha_Payments` folder

You can:
- View all uploads by date
- Download individual files or entire folders
- See metadata for each file
- Generate reports
- Share links

## 🚀 Deployment Options

### Option 1: Local Network (Quickest)
```bash
npm start
# Share your local IP: http://192.168.x.x:3000
```

### Option 2: Heroku
```bash
heroku create anokha-payment-collector
git push heroku main
```

### Option 3: Vercel/Netlify
- Deploy as serverless function
- Add environment variables in dashboard

### Option 4: Railway/Render (Recommended)
- Connect GitHub repo
- Add environment variables
- Auto-deploy
- Free tier available

## 🔒 Security Notes

- Never commit `.env` file
- Keep `CLOUDINARY_API_SECRET` secure
- Use HTTPS in production
- File size limit: 10MB
- Validate file types on both client and server

## 💰 Cloudinary Free Tier Limits

- ✅ 25GB Storage
- ✅ 25GB Bandwidth/month
- ✅ 25 Credits/month
- ✅ Unlimited transformations
- ✅ No credit card required
- ✅ No expiration

**Perfect for your 3-day event!**

## 🐛 Troubleshooting

**Error: Authentication failed**
- Check `CLOUDINARY_CLOUD_NAME`, `API_KEY`, `API_SECRET`
- Make sure no extra spaces in `.env`

**Upload fails**
- Check file size < 10MB
- Verify file format (JPG, PNG, GIF, PDF)
- Check internet connection
- Verify Cloudinary credentials

**Date not detected**
- Verify EVENT_DAY dates format: `YYYY-MM-DD`
- Check server date/time is correct

**"Cloudinary not configured" warning**
- Fill all three Cloudinary credentials in `.env`
- Restart server after updating `.env`

## 📞 Support

For issues or questions, check:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com)

## 📝 License

MIT License - Free to use and modify
