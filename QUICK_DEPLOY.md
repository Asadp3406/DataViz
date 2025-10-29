# 🚀 Quick Deploy Guide (5 Minutes)

## Fastest Way to Deploy (Recommended)

### Option 1: Vercel (Frontend) + Render (Backend)

#### Step 1: Push to GitHub (1 min)
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/Asadp3406/DataViz.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy Backend on Render (2 min)
1. Go to https://render.com/deploy
2. Click "New +" → "Web Service"
3. Connect GitHub → Select `Asadp3406/DataViz`
4. Settings:
   - **Name**: `dataviz-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Click "Create Web Service"
6. **Copy your backend URL** (e.g., `https://dataviz-backend.onrender.com`)

#### Step 3: Update Frontend API URL (30 sec)
Edit `frontend/src/utils/api.js`:
```javascript
const API_BASE_URL = 'https://dataviz-backend.onrender.com'  // Your Render URL
```

Commit and push:
```bash
git add frontend/src/utils/api.js
git commit -m "Update API URL"
git push
```

#### Step 4: Deploy Frontend on Vercel (1 min)
1. Go to https://vercel.com/new
2. Import `Asadp3406/DataViz`
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
4. Click "Deploy"
5. Done! 🎉

#### Step 5: Update CORS (30 sec)
Edit `backend/app.py`, add your Vercel URL:
```python
allow_origins=[
    "http://localhost:5173",
    "https://your-app.vercel.app"  # Add this
],
```

Push to GitHub - Render auto-deploys!

---

## Option 2: One-Click Deploy with Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose `Asadp3406/DataViz`
5. Railway auto-detects and deploys both!
6. Done! 🎉

---

## Option 3: Render Only (Both Services)

Use the included `render.yaml`:
1. Go to https://render.com
2. Click "New +" → "Blueprint"
3. Connect GitHub → Select `Asadp3406/DataViz`
4. Render deploys both frontend and backend automatically!

---

## ✅ Your App is Live!

**Frontend**: `https://your-app.vercel.app`
**Backend**: `https://dataviz-backend.onrender.com`

**Note**: First backend request may take 30-60 seconds (free tier wakes from sleep).

---

## 🔧 Environment Variables (Optional)

### Vercel (Frontend)
Add in Vercel dashboard → Settings → Environment Variables:
- `VITE_API_URL`: Your Render backend URL

### Render (Backend)
No environment variables needed for basic setup.

---

## 📱 Share Your App

Your app is now publicly accessible! Share the Vercel URL with anyone.

---

## 🔄 Auto-Deploy Updates

Any push to GitHub automatically deploys:
- Vercel: Instant deployment
- Render: ~2-3 minutes

```bash
git add .
git commit -m "Update feature"
git push
```

Done! Your changes are live.
