# 🎬 Video Downloader & Website Project

A comprehensive web application featuring a YouTube/Facebook video downloader, blog management system, landing page builder, and more.

## 📁 Project Structure

```
demo2/
├── 📂 backend/                 # Backend API and server
│   ├── 📄 app.py              # Main Flask application
│   ├── 📄 main.py             # Entry point for deployment
│   ├── 📄 requirements.txt    # Python dependencies
│   ├── 📄 Procfile           # Heroku deployment config
│   ├── 📄 runtime.txt        # Python version specification
│   ├── 📂 api/               # API endpoints (future)
│   ├── 📂 utils/             # Utility functions (future)
│   └── 📂 downloads/         # Downloaded videos (auto-created)
│
├── 📂 frontend/               # Frontend files
│   ├── 📂 pages/             # HTML pages
│   │   ├── 📄 index.html     # Main website
│   │   ├── 📄 video-downloader.html
│   │   ├── 📄 all-articles.html
│   │   ├── 📄 blog-article.html
│   │   ├── 📄 admin.html
│   │   ├── 📄 admin-panel.html
│   │   ├── 📄 landing-builder.html
│   │   ├── 📄 test-builder.html
│   │   └── 📄 landing-builder-demo.html
│   ├── 📂 js/                # JavaScript files
│   │   ├── 📄 script.js      # Main website scripts
│   │   ├── 📄 video-downloader.js
│   │   ├── 📄 articles.js
│   │   ├── 📄 articles-manager.js
│   │   ├── 📄 admin.js
│   │   └── 📄 landing-builder.js
│   ├── 📂 css/               # Stylesheets
│   │   └── 📄 styles.css     # Main stylesheet
│   └── 📂 assets/            # Images, icons, etc.
│
├── 📂 docs/                   # Documentation
│   └── 📂 guides/            # Setup and usage guides
│       ├── 📄 VIDEO-DOWNLOADER-SETUP.md
│       ├── 📄 DEPLOYMENT-GUIDE.md
│       ├── 📄 BLOG-MANAGEMENT-GUIDE.md
│       ├── 📄 LANDING-PAGE-BUILDER-GUIDE.md
│       └── 📄 SEO-SETUP-GUIDE.md
│
├── 📂 scripts/                # Utility scripts
│   ├── 📄 start_server.py    # Local server startup
│   ├── 📄 start_server_new.py # New structure startup
│   ├── 📄 start_server.bat   # Windows batch file
│   └── 📄 update-api-url.js  # API URL updater
│
├── 📄 README.md              # This file
├── 📄 CNAME                  # Custom domain
├── 📄 robots.txt             # SEO robots file
├── 📄 sitemap.xml            # SEO sitemap
└── 📄 .gitignore             # Git ignore file
```

## 🚀 Quick Start

### **Option 1: Using the New Structure (Recommended)**

1. **Install Dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Start the Server:**
   ```bash
   python scripts/start_server_new.py
   ```

3. **Open Frontend:**
   - Open `frontend/pages/index.html` in your browser
   - Or serve with: `python -m http.server 8000`

### **Option 2: Using Windows Batch File**

```bash
# Double-click or run:
scripts/start_server.bat
```

### **Option 3: Direct Backend Start**

```bash
cd backend
python main.py
```

## 🌐 Features

### **🎬 Video Downloader**
- ✅ YouTube video downloading
- ✅ Facebook video downloading
- ✅ Rate limiting and security
- ✅ Video information preview
- ✅ Multiple format support
- ✅ Mobile-friendly interface

### **📝 Blog Management**
- ✅ Article creation and editing
- ✅ Category management
- ✅ Search and filtering
- ✅ Admin panel
- ✅ SEO optimization

### **🏗️ Landing Page Builder**
- ✅ Drag-and-drop interface
- ✅ Pre-built components
- ✅ Real-time preview
- ✅ Export functionality
- ✅ Responsive design

### **🔧 Admin Panel**
- ✅ Article management
- ✅ User interface
- ✅ CRUD operations
- ✅ Local storage

## 📱 Pages Overview

| Page | Description | Location |
|------|-------------|----------|
| **Home** | Main website with services | `frontend/pages/index.html` |
| **Video Downloader** | YouTube/Facebook downloader | `frontend/pages/video-downloader.html` |
| **All Articles** | Blog article listing | `frontend/pages/all-articles.html` |
| **Blog Article** | Individual article template | `frontend/pages/blog-article.html` |
| **Admin Panel** | Article management | `frontend/pages/admin-panel.html` |
| **Landing Builder** | Page builder tool | `frontend/pages/landing-builder.html` |

## 🔧 Configuration

### **Backend Configuration**
Edit `backend/app.py` to modify:
- Rate limiting: `MAX_DOWNLOADS_PER_HOUR`
- Allowed domains: `ALLOWED_DOMAINS`
- Download folder: `DOWNLOAD_FOLDER`

### **Frontend Configuration**
- API URL: Edit `frontend/js/video-downloader.js`
- Styles: Edit `frontend/css/styles.css`
- Content: Edit individual HTML files

## 🌍 Deployment

### **Local Development**
```bash
# Start backend
python scripts/start_server_new.py

# Serve frontend (optional)
python -m http.server 8000
```

### **Cloud Deployment**
See `docs/guides/DEPLOYMENT-GUIDE.md` for detailed instructions.

**Quick Deploy:**
1. Choose platform (Heroku, Railway, Render)
2. Upload backend files
3. Update frontend API URL
4. Deploy and test

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server status |
| `/api/info` | POST | Get video information |
| `/api/download` | POST | Download video |
| `/api/download-file/<filename>` | GET | Serve downloaded file |
| `/api/cleanup` | POST | Clean old files |

## 🛠️ Development

### **Adding New Features**
1. **Backend:** Add to `backend/app.py` or create new modules
2. **Frontend:** Add HTML to `frontend/pages/` and JS to `frontend/js/`
3. **Styles:** Update `frontend/css/styles.css`
4. **Documentation:** Add guides to `docs/guides/`

### **File Organization**
- **Backend:** All server-side code in `backend/`
- **Frontend:** All client-side code in `frontend/`
- **Scripts:** Utility scripts in `scripts/`
- **Docs:** Documentation in `docs/`

## 🔒 Security Features

- ✅ Rate limiting (10 downloads/hour per IP)
- ✅ Domain validation (YouTube/Facebook only)
- ✅ Input sanitization
- ✅ Error handling
- ✅ File cleanup (24-hour auto-delete)
- ✅ CORS protection

## 📱 Browser Support

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🐛 Troubleshooting

### **Common Issues:**

1. **"Backend not available"**
   - Check if server is running
   - Verify port 5000 is available
   - Check API URL in frontend

2. **"Module not found"**
   - Install dependencies: `pip install -r backend/requirements.txt`
   - Check Python version (3.7+)

3. **"CORS error"**
   - Update CORS settings in backend
   - Check frontend API URL

4. **"File not found"**
   - Check file paths in new structure
   - Verify all files are in correct folders

## 📞 Support

- **Documentation:** Check `docs/guides/` for detailed guides
- **Issues:** Review troubleshooting section above
- **Updates:** Keep dependencies updated

## 📄 License

This project is for educational purposes. Please respect copyright laws and terms of service when using the video downloader.

## 🎯 Next Steps

1. **Test all features** locally
2. **Deploy to cloud** for global access
3. **Add custom domain** for branding
4. **Monitor usage** and performance
5. **Add more features** as needed

---

**Happy coding! 🚀**