# DataViz Studio - Free Deployment Guide

This guide will help you deploy DataViz Studio for free using Vercel (Frontend) and Render (Backend).

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Render account (sign up at https://render.com)

---

## Step 1: Push Code to GitHub

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - DataViz Studio"
```

2. **Add your GitHub repository as remote**:
```bash
git remote add origin https://github.com/Asadp3406/DataViz.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render (Free)

### 2.1 Create Render Account
- Go to https://render.com
- Sign up with your GitHub account

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Asadp3406/DataViz`
3. Configure the service:

**Settings:**
- **Name**: `dataviz-backend` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- **Instance Type**: `Free`

### 2.3 Environment Variables (Optional)
- No environment variables needed for basic setup

### 2.4 Deploy
- Click **"Create Web Service"**
- Wait 5-10 minutes for deployment
- Copy your backend URL (e.g., `https://dataviz-backend.onrender.com`)

**Important Note**: Free Render services sleep after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

---

## Step 3: Deploy Frontend to Vercel (Free)

### 3.1 Update API URL
Before deploying, update the frontend to use your Render backend URL:

**File**: `frontend/src/utils/api.js`

Replace:
```javascript
const API_BASE_URL = 'http://localhost:8000'
```

With your Render URL:
```javascript
const API_BASE_URL = 'https://dataviz-backend.onrender.com'
```

Commit this change:
```bash
git add frontend/src/utils/api.js
git commit -m "Update API URL for production"
git push
```

### 3.2 Create Vercel Account
- Go to https://vercel.com
- Sign up with your GitHub account

### 3.3 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository: `Asadp3406/DataViz`
3. Configure the project:

**Settings:**
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.4 Deploy
- Click **"Deploy"**
- Wait 2-3 minutes for deployment
- Your site will be live at: `https://your-project-name.vercel.app`

---

## Step 4: Update CORS Settings

After deployment, update your backend CORS settings to allow your Vercel domain.

**File**: `backend/app.py`

Update the CORS middleware:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://your-project-name.vercel.app"  # Add your Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push:
```bash
git add backend/app.py
git commit -m "Update CORS for production"
git push
```

Render will automatically redeploy your backend.

---

## Alternative: Deploy Both on Render

If you prefer to deploy both frontend and backend on Render:

### Backend (Same as above)
Follow Step 2

### Frontend on Render
1. Create new **Static Site** on Render
2. Connect your repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL

---

## Alternative: Deploy on Railway (All-in-One)

Railway offers free tier for both frontend and backend:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect and deploy both services

---

## Cost Comparison

| Platform | Frontend | Backend | Free Tier Limits |
|----------|----------|---------|------------------|
| **Vercel + Render** | Free | Free | 750 hours/month backend, unlimited frontend |
| **Render Only** | Free | Free | 750 hours/month |
| **Railway** | Free | Free | $5 credit/month |
| **Netlify + Render** | Free | Free | Similar to Vercel |

---

## Recommended Setup (Best Free Option)

✅ **Frontend**: Vercel (Fast, unlimited bandwidth)
✅ **Backend**: Render (750 hours free, auto-sleep)

---

## Troubleshooting

### Backend takes long to respond
- Free Render services sleep after 15 minutes
- First request wakes it up (30-60 seconds)
- Consider upgrading to paid tier ($7/month) for always-on

### CORS errors
- Make sure you added your Vercel URL to CORS settings
- Check that API_BASE_URL is correct in frontend

### Build fails on Vercel
- Ensure `frontend` is set as root directory
- Check that all dependencies are in package.json

### Backend build fails on Render
- Verify requirements.txt has all dependencies
- Check Python version compatibility

---

## Post-Deployment

1. **Test your app**: Visit your Vercel URL
2. **Share**: Your app is now live and shareable!
3. **Monitor**: Check Render dashboard for backend logs
4. **Update**: Push to GitHub to auto-deploy updates

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render
1. Go to Service Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- GitHub Issues: Create an issue in your repo

---

**Congratulations! Your DataViz Studio is now live! 🎉**
