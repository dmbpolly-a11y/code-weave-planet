# Deployment Guide - Code Weave Planet

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel provides the easiest deployment for Vite React apps with automatic builds and deployments.

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to Git Repository**
   ```bash
   # If you haven't set git user config yet
   git config user.email "your-email@example.com"
   git config user.name "Your Name"
   
   # Commit your code
   git commit -m "Complete Code Weave Planet app with auth and CRUD"
   
   # Create a new repository on GitHub, then:
   git remote add origin https://github.com/yourusername/code-weave-planet.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up" (use GitHub account for easy integration)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
   - Click "Deploy"

3. **Your site is live!** 🎉
   - Vercel provides a URL like: `code-weave-planet.vercel.app`
   - Every push to `main` triggers automatic redeployment

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🌐 Other Deployment Options

### Deploy to Netlify

1. **Via Netlify Dashboard**
   - Sign up at [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your Git repository

2. **Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

3. **Via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

### Deploy to GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add to `package.json`:
   ```json
   {
     "homepage": "https://yourusername.github.io/code-weave-planet",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/code-weave-planet/'
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure**
   - Public directory: `dist`
   - Single-page app: `Yes`
   - Set up automatic builds: `No`

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 🔧 Environment Configuration

### No Environment Variables Required!

This app works out of the box with no configuration. However, if you want to add environment variables later:

1. Create `.env` file:
   ```env
   VITE_API_URL=https://api.yourbackend.com
   VITE_WHATSAPP_NUMBER=0750937506
   ```

2. Access in code:
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL
   ```

3. Add `.env` to `.gitignore` (already done)

## 📊 Post-Deployment Checklist

- [ ] Test all three user roles (Admin, Tutor, Student)
- [ ] Verify login/logout functionality
- [ ] Test CRUD operations in admin panel
- [ ] Check responsive design on mobile
- [ ] Test course enrollment flow
- [ ] Verify WhatsApp links work
- [ ] Test search functionality
- [ ] Check that logo displays correctly

## 🎯 Custom Domain (Optional)

### On Vercel

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records at your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### On Netlify

1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records

## 🔒 Security Considerations

### Before Production (Important!)

This demo app uses localStorage for authentication. For production:

1. **Add Backend API**
   - Use proper JWT tokens
   - Implement refresh tokens
   - Store tokens in httpOnly cookies

2. **Use Real Database**
   - PostgreSQL, MongoDB, or Firebase
   - Proper data validation
   - SQL injection prevention

3. **Add HTTPS**
   - Vercel provides HTTPS automatically
   - Ensure all API calls use HTTPS

4. **Implement Rate Limiting**
   - Prevent brute force attacks
   - Use services like Cloudflare

5. **Add Input Validation**
   - Server-side validation
   - Sanitize user inputs
   - Prevent XSS attacks

## 📈 Performance Optimization

Already implemented:
- ✅ Code splitting with React Router
- ✅ Optimized SVG logo
- ✅ Minimal dependencies
- ✅ CSS instead of heavy CSS frameworks
- ✅ Production build optimization

## 🐛 Troubleshooting

### Build fails on Vercel
- Check Node version (should be 18+)
- Verify all imports are correct
- Check console for specific errors

### Routing doesn't work after deployment
- Ensure you're using HashRouter or properly configured server redirects
- Current setup uses BrowserRouter (works on Vercel)

### Images not loading
- Check image paths are relative
- Verify images are in `public` or imported in components

## 📞 Support

For deployment issues specific to Code Weave Planet:
- WhatsApp: 0750937506
- Check the GitHub issues (if repository is public)

## 🎉 Congratulations!

Your Code Weave Planet app is now live and accessible worldwide!

---

**Next Steps:**
1. Share the link with tutors and students
2. Gather feedback
3. Plan backend integration
4. Add more features based on user needs
