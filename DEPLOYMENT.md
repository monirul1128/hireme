# 🚀 Deployment Guide

This guide will help you deploy your WebCraft Studio project to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] All files are committed to Git
- [ ] README.md is updated
- [ ] .gitignore is configured
- [ ] No sensitive data in code
- [ ] All features tested locally

## 🌐 GitHub Pages (Recommended for Static)

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it: `webcraft-studio`
4. Make it public
5. Don't initialize with README (we have one)

### Step 2: Push Your Code
```bash
git init
git add .
git commit -m "Initial commit: WebCraft Studio portfolio"
git branch -M main
git remote add origin https://github.com/yourusername/webcraft-studio.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository Settings
2. Scroll to "Pages" section
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Folder: "/ (root)"
6. Click "Save"

### Step 4: Access Your Site
- URL: `https://yourusername.github.io/webcraft-studio`
- Chat will work in demo mode automatically

## 🎯 Netlify (Alternative Static Hosting)

### Step 1: Connect to GitHub
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub
4. Select your repository

### Step 2: Configure Build Settings
- Build command: (leave empty for static site)
- Publish directory: `/` (root)
- Click "Deploy site"

### Step 3: Custom Domain (Optional)
1. Go to "Domain settings"
2. Add custom domain
3. Configure DNS

## 🔥 Vercel (Fast Performance)

### Step 1: Deploy
1. Go to [Vercel](https://vercel.com)
2. Import from GitHub
3. Select your repository
4. Deploy

### Step 2: Configure
- Framework Preset: Other
- Build Command: (none)
- Output Directory: (root)

## 🐍 Full Stack Deployment (With Chat Server)

### Railway (Recommended)
1. Go to [Railway](https://railway.app)
2. Connect GitHub repository
3. Add environment variables:
   ```
   FLASK_ENV=production
   PORT=4000
   SECRET_KEY=your-secret-key-here
   ```
4. Deploy

### Heroku
1. Create `Procfile`:
   ```
   web: python production_server_windows.py
   ```
2. Add `runtime.txt`:
   ```
   python-3.13.5
   ```
3. Deploy to Heroku

### DigitalOcean App Platform
1. Connect GitHub repository
2. Choose Python environment
3. Set build command: `pip install -r requirements_production.txt`
4. Set run command: `python production_server_windows.py`

## 🔧 Environment Variables

### Required Variables
```bash
FLASK_ENV=production
PORT=4000
SECRET_KEY=your-secret-key-here
```

### Optional Variables
```bash
ALLOWED_ORIGINS=https://yourdomain.com
GUNICORN_WORKERS=4
```

## 📱 Mobile Deployment

### Progressive Web App (PWA)
Add to your `index.html`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#007bff">
```

### App Stores
- **iOS**: Use WebView wrapper
- **Android**: Use PWA or WebView
- **Desktop**: Use Electron

## 🔒 Security Considerations

### Before Deployment
- [ ] Remove any hardcoded secrets
- [ ] Use environment variables
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Add rate limiting

### Production Checklist
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring set up
- [ ] Backup strategy
- [ ] Error logging

## 📊 Performance Optimization

### Frontend
- Minify CSS/JS
- Optimize images
- Enable compression
- Use CDN for assets

### Backend
- Enable caching
- Optimize database queries
- Use connection pooling
- Monitor performance

## 🐛 Troubleshooting

### Common Issues

1. **Chat not working**
   - Check if server is running
   - Verify CORS settings
   - Check browser console for errors

2. **404 errors**
   - Verify file paths
   - Check .htaccess (if using Apache)
   - Ensure all files are committed

3. **CORS errors**
   - Update ALLOWED_ORIGINS
   - Check server configuration
   - Verify domain settings

4. **Build failures**
   - Check Python version
   - Verify dependencies
   - Check build logs

## 📈 Monitoring & Analytics

### Recommended Tools
- **Google Analytics** - Traffic analysis
- **Sentry** - Error tracking
- **Uptime Robot** - Uptime monitoring
- **Google Search Console** - SEO monitoring

### Setup Instructions
1. Add tracking codes to `index.html`
2. Configure error reporting
3. Set up uptime monitoring
4. Monitor performance metrics

## 🔄 Continuous Deployment

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review platform documentation
3. Check GitHub issues
4. Contact support

---

**Happy Deploying! 🚀** 