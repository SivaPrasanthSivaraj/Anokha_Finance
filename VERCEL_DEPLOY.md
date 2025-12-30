# Vercel Deployment Guide

## Quick Deploy

1. **Push to GitHub** (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Node.js project

3. **Add Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add these variables:
     ```
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     EVENT_DAY_1=2026-01-07
     EVENT_DAY_2=2026-01-08
     EVENT_DAY_3=2026-01-09
     ```

4. **Redeploy**:
   - Click "Redeploy" or push new commit

## Important Notes

- `vercel.json` configures serverless function routing
- Server code now works both locally and on Vercel
- Upload folder is temporary (serverless functions are stateless)
- Files upload directly to Cloudinary, so no storage issues

## Testing Locally

Still works the same:
```bash
npm run dev
```

## Troubleshooting

If you still get errors:
1. Check environment variables are set in Vercel
2. Check deployment logs in Vercel dashboard
3. Verify Cloudinary credentials are correct
