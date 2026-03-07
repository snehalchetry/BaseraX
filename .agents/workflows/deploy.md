---
description: Deploy the backend to Render and frontend to Vercel
---
Because Vercel only supports serverless functions out of the box, standard Express applications are best deployed to Render.com.

1. **Deploy Backend to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository (`snehalchetry/BaseraX`)
   - **Important**: Set the Root Directory to `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add your Environment Variables: `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
   - Deploy and copy the provided `onrender.com` URL.

2. **Update Frontend API URL**:
   - Open `c:\HostelERP\client\src\api\client.ts`
   - Change `baseURL: '/api'` to `baseURL: 'https://your-new-render-url.onrender.com/api'`

3. **Deploy Frontend to Vercel**:
   - Commit the URL change to GitHub.
   - Vercel will automatically redeploy the frontend with the new Render backend endpoint.
